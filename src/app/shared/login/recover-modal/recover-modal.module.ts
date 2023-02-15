import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoverModalComponent } from './recover-modal.component';
import { ModalModule } from '../../modal/modal.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [RecoverModalComponent],
  exports: [RecoverModalComponent],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    TranslateModule
  ]
})
export class RecoverModalModule { }
