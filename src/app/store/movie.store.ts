import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { PlatformService } from '@services/platform.service';
import { Item, MovieState, MovieStateFilter } from './movie.state';

const initialState: MovieState = {
  favourites: {},
  filter: {
    order: 'ASC',
    searchTerm: '',
  },
  isLoading: false,
};

const FAV_ITEMS_LOCAL_STORAGE = 'favMovies';

export const MovieStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withDevtools('movie'),
  withComputed((state) => ({
    favouritesSignal: computed(() => state.favourites()),
    searchTermSignal: computed(() => state.filter.searchTerm()),
  })),
  withMethods((store, platformService = inject(PlatformService)) => ({
    addFavourite(id: Item['id']): void {
      const favsInLocalStorage: Record<string, true> = JSON.parse(
        platformService.localStorage?.getItem(FAV_ITEMS_LOCAL_STORAGE) ?? '{}',
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
  })),
  withHooks(
    (
      store,
      platformService = inject(PlatformService),
      router = inject(Router),
      route = inject(ActivatedRoute),
    ) => ({
      onInit() {
        const favsInLocalStorage = JSON.parse(
          platformService.localStorage?.getItem(FAV_ITEMS_LOCAL_STORAGE) ??
            '{}',
        );

        const searchTermFromParams =
          route.snapshot.queryParamMap.get('searchTerm') ?? null;

        patchState(store, (state) => ({
          favourites: {
            ...state.favourites,
            ...favsInLocalStorage,
          },
          filter: {
            ...state.filter,
            searchTerm: searchTermFromParams,
          },
        }));

        effect(() => {
          const searchTerm = store.filter.searchTerm();

          router.navigate([], {
            queryParams: {
              searchTerm: searchTerm?.length ? searchTerm : null,
            },
          });
        });
      },
    }),
  ),
);
