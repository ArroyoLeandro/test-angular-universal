import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosComponent } from './turnos.component';
import { TurnosRoutingModule } from './turnos-routing.module';
import { Step01Component } from './step01/step01.component';
import { Step02Component } from './step02/step02.component';
import { Step03Component } from './step03/step03.component';
import { Step04Component } from './step04/step04.component';
import { Step05Component } from './step05/step05.component';
import { Step06Component } from './step06/step06.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ModalTurnosModule } from './modalTurnos/modal-turnos.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    TurnosComponent,
    Step01Component,
    Step02Component,
    Step03Component,
    Step04Component,
    Step05Component,
    Step06Component
  ],
  exports: [
    TurnosComponent,
    Step01Component,
    Step02Component,
    Step03Component,
    Step04Component,
    Step05Component,
    Step06Component
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule,
    ComponentsModule,
    ModalTurnosModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class TurnosModule { }
