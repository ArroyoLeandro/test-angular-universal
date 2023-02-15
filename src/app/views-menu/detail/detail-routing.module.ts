import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail.component';

export const routes: Routes = [
  { path: ':id', component: DetailComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DetailRoutingModule { }
