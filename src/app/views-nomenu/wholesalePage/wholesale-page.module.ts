import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WholesalePageComponent } from './wholesale-page.component';
import { WholesalePageRoutingModule } from './wholesale-page-routing.module';
import { LoginComponent } from '../../shared/login/login.component';
import { RegisterComponent } from '../../shared/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    WholesalePageComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    WholesalePageRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class WholesalePageModule { }
