import { MovieResponse } from '@pages/movies/_model/movie-response.model';

export interface MovieState {
  lastVisited: Record<
    MovieResponse['slug'],
    {
      data: MovieResponse & { accessDate: Date };
    }
  >;

  isLoading: boolean;
  filter: MovieStateFilter;
  movies: Record<string, MovieResponse>;

  config: {
    loadDelay: number;
    loadOffset: number;
    isMenuCollapsed: boolean;
    totalLastVisited: number;
  };
}

export interface MovieStateFilter {
  searchTerm: string | null;
  first: number;
  offset: number;
  genre: string[] | null;
}
