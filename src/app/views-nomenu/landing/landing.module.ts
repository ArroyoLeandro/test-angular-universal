import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    LandingComponent
  ],
  exports: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    ComponentsModule,
    TranslateModule
  ]
})
export class LandingModule { }
