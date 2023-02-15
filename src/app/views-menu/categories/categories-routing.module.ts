import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';

export const routes: Routes = [
  { path: ':category', component: CategoriesComponent },
  { path: ':category/:sub_category', component: CategoriesComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
