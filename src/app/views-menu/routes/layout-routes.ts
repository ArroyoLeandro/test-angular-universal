import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
export const full_routes: Routes = [

  {
    path: 'wholesales',
    canActivate: [AuthGuard],
    children: [
      {
        path: '', 
        loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'product',
        loadChildren: () => import('../detail/detail.module').then(m => m.DetailModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: '',
        loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesModule)
      }
    ]
  },
  {
    path: '',
    loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'turnos',
    loadChildren: () => import('../turnos/turnos.module').then(m => m.TurnosModule)
  },
  {
    path: 'cart/:id',
    loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'product',
    loadChildren: () => import('../detail/detail.module').then(m => m.DetailModule)
  },
  {
    path: 'how-works',
    loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('../about-us/about-us.module').then(m => m.AboutUsModule)
  },
  {
    path: 'politics',
    loadChildren: () => import('../politicas/politicas.module').then(m => m.PoliticasModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('../terms/terms.module').then(m => m.TermsModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('../../views-nomenu/contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: 'search',
    loadChildren: () => import('../searchPage/search-page.module').then(m => m.SearchPageModule)
  },
  {
    path: '',
    loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesModule)
  }
]
