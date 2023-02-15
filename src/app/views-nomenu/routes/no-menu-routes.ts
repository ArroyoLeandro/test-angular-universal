import { Routes } from '@angular/router';

export const no_menu: Routes = [
  {
    path: '',
    loadChildren: () => import('../landing/landing.module').then(m => m.LandingModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('../contact/contact.module').then(m => m.ContactModule)
  }
  // {
  //   path: 'login',
  //   loadChildren: () => import('../wholesalePage/wholesale-page.module').then(m => m.WholesalePageModule)
  // },
  // {
  //   path: 'recover',
  //   loadChildren: () => import('../recover/recover.module').then(m => m.RecoverModule)
  // },
  // {
  //   path: 'lanzamientos',
  //   loadChildren: () => import('../../views-nomenu/lanzamientos/lanzamientos.module').then(m => m.LanzamientosModule)
  // },
  // {
  //   path: 'menu',
  //   loadChildren: () => import('../../views-nomenu/menu/menu.module').then(m => m.MenuModule)
  // }, 
  // {
  //   path: 'user-activate/:token',
  //   loadChildren: () => import('../password/password.module').then(m => m.PasswordModule)
  // }
]
