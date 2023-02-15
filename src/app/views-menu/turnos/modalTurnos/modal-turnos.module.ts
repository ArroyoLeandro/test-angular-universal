import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTurnosComponent } from './modal-turnos/modal-turnos.component';
import { ModalModule } from 'src/app/shared/modal/modal.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [ModalTurnosComponent],
  exports: [ModalTurnosComponent],
  imports: [
    CommonModule,
    ModalModule,
    TranslateModule
  ]
})
export class ModalTurnosModule { }
