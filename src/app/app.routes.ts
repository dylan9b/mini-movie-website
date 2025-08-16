import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout.component').then(
        (c) => c.LayoutComponent,
      ),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((c) => c.HomeComponent),
        data: {
          title: 'Home',
        },
      },
      {
        path: 'movies',
        loadComponent: () =>
          import('./pages/movies/movies.component').then(
            (c) => c.MoviesComponent,
          ),
        data: {
          title: 'All Movies',
        },
      },
      {
        path: 'movies/:slug',
        loadComponent: () =>
          import('./pages/movies/movie-detail/movie-detail.component').then(
            (c) => c.MovieDetailComponent,
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
