import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';

export const routes: Routes = [{path: '', component: ProfileComponent}]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
