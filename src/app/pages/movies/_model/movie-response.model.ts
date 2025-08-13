export interface MovieResponse {
  id: string;
  title: string;
  popularity: number;
  image: {
    url: string;
    title: string;
  };
  slug: string;
  runtime: string;
  released: string;
  genres: string[];
  budget: number | null;
}
