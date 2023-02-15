import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { LanzamientosComponent } from './lanzamientos.component';

export const routes: Routes = [
  { path: '', component: LanzamientosComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LanzamientosRoutingModule { }
