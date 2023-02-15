import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Routes } from '@angular/router';
import { RecoverComponent } from './recover.component';

export const routes: Routes = [{path: '', component: RecoverComponent}]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RecoverRoutingModule { }
