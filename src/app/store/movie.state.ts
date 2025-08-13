export interface MovieState {
  // Added favourites object like this so that it's faster and easier to access an item by id rather than looping through the list.
  favourites: Record<Item['id'], boolean>;

  isLoading: boolean;
  filter: MovieStateFilter;
}

export interface Item {
  id: string;
  isFavourite: boolean;
}

export interface MovieStateFilter {
  searchTerm: string | null;
  order: 'ASC' | 'DESC';
}
