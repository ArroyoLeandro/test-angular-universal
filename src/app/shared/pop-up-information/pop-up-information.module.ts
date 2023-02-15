import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopUpInformationComponent } from './pop-up-information.component';
import { ModalModule } from '../modal/modal.module';



@NgModule({
  declarations: [PopUpInformationComponent],
  exports: [PopUpInformationComponent],
  imports: [
    CommonModule,
    CommonModule,
    ModalModule
  ]
})
export class PopUpInformationModule { }
