import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewsComponent } from './views-menu/views/views.component';
import { full_routes } from './views-menu/routes/layout-routes';
import { ViewsNomenuComponent } from './views-nomenu/views-nomenu/views-nomenu.component';
import { no_menu } from './views-nomenu/routes/no-menu-routes';

const routes: Routes = [  
  {
    path: '',
    redirectTo: '/tecnoweb',
    pathMatch: 'full',
  },
  {
    path: '', component: ViewsNomenuComponent, children: no_menu
  },
  {
    path: ':id', component: ViewsComponent, children: full_routes
  }
  
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    //  RouterModule.forRoot(routes, { useHash: true } ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
