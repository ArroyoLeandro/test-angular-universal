import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us.component';
import { AboutUsRoutingModule } from './about-us-routing.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    AboutUsComponent
  ],
  exports: [
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    AboutUsRoutingModule,
    TranslateModule
  ]
})
export class AboutUsModule { }
