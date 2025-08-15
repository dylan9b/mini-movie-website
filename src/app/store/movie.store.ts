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
import { Item, MovieState, MovieStateFilter } from './movie.state';

const initialState: MovieState = {
  favourites: {},
  filter: {
    order: 'ASC',
    searchTerm: null,
    first: 10,
    offset: 0,
    sortBy: null,
    genre: null,
  },
  config: {
    loadDelay: 500,
    loadOffset: 10,
    isMenuCollapsed: false,
  },
  isLoading: false,
  movies: {},
};

const FAV_ITEMS_LOCAL_STORAGE = 'favMovies';

export const MovieStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withDevtools('movie'),
  withComputed((state) => {
    const moviesSignal = computed(() => {
      const searchTerm = (state.filter().searchTerm ?? '').toLowerCase();
      const selectedGenres = state.filter().genre ?? [];

      return Object.values(state.movies())
        .filter((movie) => {
          const matchesSearch =
            !searchTerm || movie.title.toLowerCase().includes(searchTerm);

          const matchesGenres =
            !selectedGenres.length ||
            movie.genres.some((genre) => selectedGenres.includes(genre));

          return matchesSearch && matchesGenres;
        })
        .slice(0, state.filter().first + state.filter().offset);
    });

    return {
      favouritesSignal: computed(() => state.favourites()),
      searchTermSignal: computed(() => state.filter.searchTerm()),
      filterSignal: computed(() => state.filter()),
      moviesSignal,
      genreSignal: computed(() =>
        [...new Set(moviesSignal().flatMap((movie) => movie.genres))].sort(
          (a, b) => (a > b ? 1 : -1),
        ),
      ),
      topMoviesSignal: computed(() =>
        Object.values(state.movies())
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
      addFavourite(id: Item['id']): void {
        const favsInLocalStorage: Record<string, true> = JSON.parse(
          platformService.localStorage?.getItem(FAV_ITEMS_LOCAL_STORAGE) ??
            '{}',
        );

        if (favsInLocalStorage[id]) return;

        favsInLocalStorage[id] = true;

        platformService.localStorage?.setItem(
          FAV_ITEMS_LOCAL_STORAGE,
          JSON.stringify(favsInLocalStorage),
        );

        patchState(store, (state) => ({
          favourites: {
            ...state.favourites,
            [id]: true,
          },
        }));
      },

      removeFavourite(id: Item['id']): void {
        const favourites = { ...store.favourites() };
        delete favourites[id];

        platformService.localStorage?.setItem(
          FAV_ITEMS_LOCAL_STORAGE,
          JSON.stringify(favourites),
        );

        patchState(store, (state) => ({
          ...state,
          favourites,
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

        const favsInLocalStorage = JSON.parse(
          platformService.localStorage?.getItem(FAV_ITEMS_LOCAL_STORAGE) ??
            '{}',
        );

        const searchTermFromParams =
          route.snapshot.queryParamMap.get('searchTerm') ?? null;
        const genresFromParams =
          route.snapshot.queryParamMap.getAll('genre') ?? null;

        patchState(store, (state) => ({
          favourites: {
            ...state.favourites,
            ...favsInLocalStorage,
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
