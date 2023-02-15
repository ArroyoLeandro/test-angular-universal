import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoliticasComponent } from './politicas.component';


export const routes: Routes = [
  { path: '', component: PoliticasComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PoliticasRoutingModule { }
