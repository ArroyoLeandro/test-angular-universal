import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { ModalPasswordModule } from './modalPassword/modal-password.module';
import { ModalAddressModule } from './modalAddress/modal-address.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProfileComponent],
  exports: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ModalPasswordModule,
    ModalAddressModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class ProfileModule { }
