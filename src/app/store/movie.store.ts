import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MovieResponse } from '@pages/movies/_model/movie-response.model';
import { MovieService } from '@services/movie.service';
import { PlatformService } from '@services/platform.service';
import { exhaustMap, pipe, tap } from 'rxjs';
import { MovieState, MovieStateFilter } from './movie.state';

const initialState: MovieState = {
  lastVisited: {},
  filter: {
    searchTerm: null,
    first: 10,
    offset: 0,
    genre: null,
  },
  config: {
    loadDelay: 500,
    loadOffset: 10,
    isMenuCollapsed: false,
    totalLastVisited: 5,
  },
  isLoading: false,
  movies: {},
};

const VISITED_ITEMS_LOCAL_STORAGE = 'visitedMovies';

export const MovieStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withDevtools('movie'),
  withComputed((state) => {
    const allMoviesSignal = computed(() => Object.values(state.movies()));

    // Movies filtered by search term and selected genres, **before pagination**
    const filteredMoviesBeforePagination = computed(() => {
      const searchTerm = (state.filter().searchTerm ?? '').toLowerCase();
      const selectedGenres = state.filter().genre ?? [];

      return allMoviesSignal().filter((movie) => {
        const matchesSearch =
          !searchTerm || movie.title.toLowerCase().includes(searchTerm);
        const matchesGenres =
          !selectedGenres.length ||
          movie.genres.some((genre) => selectedGenres.includes(genre));
        return matchesSearch && matchesGenres;
      });
    });

    // Movies after pagination
    const moviesSignal = computed(() => {
      const first = state.filter().first;
      const offset = state.filter().offset;
      return filteredMoviesBeforePagination().slice(0, first + offset);
    });

    // Genre list should depend on filtered movies **before pagination**, because pagination is only for UI purposes.
    const genreSignal = computed(() => {
      return [
        ...new Set(filteredMoviesBeforePagination().flatMap((m) => m.genres)),
      ].sort((a, b) => (a > b ? 1 : -1));
    });

    return {
      lastVisitedSignal: computed(() => Object.values(state.lastVisited())),
      genreSignal,
      moviesSignal,
      topMoviesSignal: computed(() =>
        allMoviesSignal()
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10),
      ),
    };
  }),

  withMethods(
    (
      store,
      platformService = inject(PlatformService),
      movieService = inject(MovieService),
    ) => ({
      addVisited(movie: MovieResponse): void {
        const lastVisitedInLocalStorage: MovieState['lastVisited'] = JSON.parse(
          platformService.localStorage?.getItem(VISITED_ITEMS_LOCAL_STORAGE) ??
            '{}',
        );

        const { slug } = movie;

        // Add or update slug
        lastVisitedInLocalStorage[slug] = {
          data: {
            ...movie,
            accessDate: new Date(),
          },
        };

        // Convert to entries, sort, and limit to 5
        const sortedEntries = Object.entries(lastVisitedInLocalStorage)
          .sort(
            ([, a], [, b]) =>
              new Date(b.data.accessDate).getTime() -
              new Date(a.data.accessDate).getTime(),
          )
          .slice(0, store.config.totalLastVisited());

        // Rebuild object in sorted order
        const sortedObject = Object.fromEntries(sortedEntries);

        // Save back to localStorage
        platformService.localStorage?.setItem(
          VISITED_ITEMS_LOCAL_STORAGE,
          JSON.stringify(sortedObject),
        );

        // Update store
        patchState(store, (state) => ({
          ...state,
          lastVisited: sortedObject,
        }));
      },

      updateFilter(filter: Partial<MovieStateFilter>): void {
        patchState(store, (state) => ({
          ...state,
          filter: { ...state.filter, ...filter },
        }));
      },

      updateIsMenuCollapsed(isMenuCollapsed: boolean): void {
        patchState(store, (state) => ({
          ...state,
          config: {
            ...state.config,
            isMenuCollapsed,
          },
        }));
      },

      updateIsLoading(isLoading: boolean): void {
        patchState(store, (state) => ({
          ...state,
          isLoading,
        }));
      },

      loadMovies: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          exhaustMap(() => {
            return movieService.getAll$().pipe(
              tapResponse({
                next: (movies) => {
                  // key-value pair having key set as the slug
                  const moviesById = movies.reduce<
                    Record<string, MovieResponse>
                  >((acc, movie) => {
                    acc[movie.slug] = movie;
                    return acc;
                  }, {});

                  patchState(store, { movies: moviesById });
                },
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              }),
            );
          }),
        ),
      ),
    }),
  ),
  withHooks(
    (
      store,
      platformService = inject(PlatformService),
      router = inject(Router),
      route = inject(ActivatedRoute),
    ) => ({
      onInit(): void {
        store.loadMovies();

        const lastVisitedInLocalStorage = JSON.parse(
          platformService.localStorage?.getItem(VISITED_ITEMS_LOCAL_STORAGE) ??
            '{}',
        );

        const searchTermFromParams =
          route.snapshot.queryParamMap.get('searchTerm') ?? null;
        const genresFromParams =
          route.snapshot.queryParamMap.getAll('genre') ?? null;

        patchState(store, (state) => ({
          lastVisited: {
            ...state.lastVisited,
            ...lastVisitedInLocalStorage,
          },
          filter: {
            ...state.filter,
            searchTerm: searchTermFromParams,
            genre: genresFromParams,
          },
        }));

        effect(() => {
          const { searchTerm, genre } = store.filter();

          router.navigate([], {
            queryParams: {
              searchTerm: searchTerm?.length ? searchTerm : null,
              genre: genre?.length ? genre : null,
            },
          });
        });
      },
    }),
  ),
);
