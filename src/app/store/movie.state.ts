import { MovieResponse } from '@pages/movies/_model/movie-response.model';

export interface MovieState {
  // Added favourites object like this so that it's faster and easier to access an item by id rather than looping through the list.
  favourites: Record<Item['id'], boolean>;

  isLoading: boolean;
  filter: MovieStateFilter;
  movies: MovieResponse[];

  config: {
    loadDelay: number;
    loadOffset: number;
  };
}

export interface Item {
  id: MovieResponse['id'];
  isFavourite: boolean;
}

export interface MovieStateFilter {
  searchTerm: string | null;
  order: 'ASC' | 'DESC';
  sortBy: string | null;
  first: number;
  offset: number;
  genre: string[] | null;
}
