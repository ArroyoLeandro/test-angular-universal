import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
import { TermsRoutingModule } from './terms-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    TermsComponent
  ],
  exports: [
    TermsComponent
  ],
  imports: [
    CommonModule,
    TermsRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class TermsModule { }
