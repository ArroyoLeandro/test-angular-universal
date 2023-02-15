import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalPasswordComponent } from './modal-password.component';
import { ModalModule } from 'src/app/shared/modal/modal.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ModalPasswordComponent],
  exports: [ModalPasswordComponent],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    TranslateModule
  ]
})
export class ModalPasswordModule { }
