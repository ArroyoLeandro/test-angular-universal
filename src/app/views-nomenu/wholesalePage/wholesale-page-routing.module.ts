import { NgModule } from '@angular/core';
import { WholesalePageComponent } from './wholesale-page.component';
import { RouterModule, Routes } from '@angular/router';
export const routes: Routes = [{ path: '', component: WholesalePageComponent }]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class WholesalePageRoutingModule { }
