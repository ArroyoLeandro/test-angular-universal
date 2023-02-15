import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Checkout00Component } from './checkout00/checkout00.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Checkout02Component } from './checkout02/checkout02.component';
import { Checkout03Component } from './checkout03/checkout03.component';
import { Checkout04Component } from './checkout04/checkout04.component';
import { Checkout05Component } from './checkout05/checkout05.component';
import { Checkout06Component } from './checkout06/checkout06.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { Checkout01Component } from './checkout01/checkout01.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { IMaskModule } from 'angular-imask';

@NgModule({
  declarations: [
    CheckoutComponent,
    Checkout00Component,
    Checkout01Component,
    Checkout02Component,
    Checkout03Component,
    Checkout04Component,
    Checkout05Component,
    Checkout06Component,
  ],
  exports: [
    CheckoutComponent,
    Checkout00Component,
    Checkout01Component,
    Checkout02Component,
    Checkout03Component,
    Checkout04Component,
    Checkout05Component,
    Checkout06Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    TranslateModule,
    IMaskModule,
  ],
})
export class CheckoutsModule {}
