import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecoverComponent } from './recover.component';
import { RecoverRoutingModule } from './recover-routing.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [RecoverComponent],
  exports: [RecoverComponent],
  imports: [
    CommonModule,
    RecoverRoutingModule,
    FormsModule,
    TranslateModule
  ]
})
export class RecoverModule { }
