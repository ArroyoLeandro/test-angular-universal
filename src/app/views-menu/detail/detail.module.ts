import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail.component';
import { DetailRoutingModule } from './detail-routing.module';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [
    DetailComponent
  ],
  exports: [
    DetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DetailRoutingModule,
    ComponentsModule,
    SharedModule,
    NgxSpinnerModule,
    TranslateModule,
    QuillModule.forRoot(),
    PipesModule
  ]
})
export class DetailModule { }
