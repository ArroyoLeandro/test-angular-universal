import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordComponent } from './password.component';
import { PasswordRoutingModule } from './password-routing.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [PasswordComponent],
  exports: [PasswordComponent],
  imports: [
    CommonModule,
    PasswordRoutingModule,
    FormsModule,
    TranslateModule
  ]
})
export class PasswordModule { }
