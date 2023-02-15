import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanzamientosComponent } from './lanzamientos.component';
import { LanzamientosRoutingModule } from './lanzamientos-routing.module';



@NgModule({
  declarations: [
    LanzamientosComponent
  ],
  exports: [
    LanzamientosComponent
  ],
  imports: [
    CommonModule,
    LanzamientosRoutingModule,
  ]
})
export class LanzamientosModule { }
