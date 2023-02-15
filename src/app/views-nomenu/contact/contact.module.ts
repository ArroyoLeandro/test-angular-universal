import { NgModule } from '@angular/core';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// console.log('contact')

@NgModule({
  declarations: [ContactComponent],
  exports: [ContactComponent],
  imports: [
    CommonModule,
    ContactRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class ContactModule { }
