import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPageComponent } from './search-page.component';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [
    SearchPageComponent
  ],
  exports: [
    SearchPageComponent
  ],
  imports: [
    CommonModule,
    SearchPageRoutingModule,
    FormsModule,
    ComponentsModule
  ]
})
export class SearchPageModule { }
