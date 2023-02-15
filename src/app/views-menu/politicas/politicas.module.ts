import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliticasComponent } from './politicas.component';
import { TranslateModule } from '@ngx-translate/core';
import { PoliticasRoutingModule } from './politicas-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    PoliticasComponent
  ],
  exports: [
    PoliticasComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    PoliticasRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class PoliticasModule { }
