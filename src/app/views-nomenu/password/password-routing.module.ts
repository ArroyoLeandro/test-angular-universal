import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Routes } from '@angular/router';
import { PasswordComponent } from './password.component';

export const routes: Routes = [{path: '', component: PasswordComponent}]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PasswordRoutingModule { }
