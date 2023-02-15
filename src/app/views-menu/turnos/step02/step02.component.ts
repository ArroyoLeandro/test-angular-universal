import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
@Component({
  selector: 'app-step02',
  templateUrl: './step02.component.html',
})
export class Step02Component implements OnInit {
  @Output() status: EventEmitter<any> = new EventEmitter()
  service:any = {}
  objectKeys = Object.keys

  

  constructor(
    private reservas: ReservaService
  ) {
    this.getService()
   }

  ngOnInit(): void {
  }

  getService(){
    this.reservas.getService().subscribe(service => this.service = service)
  }

  changeStep(){
    this.status.emit({step02: true, direction: 'forward'})
  }

  changeStepBack(){
    this.status.emit({step02: true, direction: 'back'})
  }

}
