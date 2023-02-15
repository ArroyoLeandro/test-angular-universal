import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalAddressComponent } from './modal-address.component';
import { ModalModule } from 'src/app/shared/modal/modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [ModalAddressComponent],
  exports: [ModalAddressComponent],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class ModalAddressModule { }
