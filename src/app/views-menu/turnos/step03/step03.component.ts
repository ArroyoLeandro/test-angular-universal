import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-step03',
  templateUrl: './step03.component.html',
  styleUrls: ['./step03.component.scss']
})
export class Step03Component implements OnInit {
  @Output() status: EventEmitter<any> = new EventEmitter()
  service:any = {}
  dateSelected : string = ''
  id_staff: string = ''
  objectKeys = Object.keys

  morning = {
    start: new Date('1/1/1999 ' + '00:00'),
    end: new Date('1/1/1999 ' + '12:00'),
  }
  afternoon = {
    start: new Date('1/1/1999 ' + '12:00'),
    end: new Date('1/1/1999 ' + '18:00'),
  }
  night = {
    start: new Date('1/1/1999 ' + '18:00'),
    end: new Date('1/1/1999 ' + '23:59'),
  }

  hoursSelected:any = {}
  clicked:any
  
  dataMorning: any[] = []
  dataAfternoon: any[] = []
  dataNight:any[] = []

  constructor(
    private reservas: ReservaService,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private translate: TranslateService
  ) 
  { this.getService() 
    this.getDaySelected()
    this.getStaff()
  }

  ngOnInit(): void {
  }

  getService(){
    this.reservas.getService().subscribe(service => this.service = service)
  }

  getDaySelected(){
    this.reservas.getDay().subscribe(date => this.dateSelected = date)
  }

  getStaff(){
    this.reservas.getStaffSelected().subscribe(staff => { this.id_staff = staff; this.getListDays() })
  }


  getListDays(){
    this.spinner.show()
    this.reservas.listDays(this.service.id_store, this.dateSelected, this.id_staff, this.service.id)
    .then(res => {
      this.filterDays(res.data)
      this.spinner.hide()
    })
    .catch(err => {
      this.dataAfternoon = []
      this.dataMorning = []
      this.dataNight = []
      this.alerts.alertError(this.translate.instant('alerts.salioMal'))
      if(err.data === 'invalid.min_day') this.alertError(this.translate.instant('alerts.fecha'), true)
      this.spinner.hide()
      this.changeStepBack()
    })
  }

  filterDays(data:[]){
    // d.start >= this.morning.start && d.end <= this.morning.start
    this.dataMorning = data.filter((d:any) => {
      let start = new Date('1/1/1999 ' + d.start);
      let end = new Date('1/1/1999 ' + d.end);

      if(start >= this.morning.start && end <= this.morning.end){
        return true
      }
    })

    this.dataAfternoon = data.filter((d:any) => {
      let start = new Date('1/1/1999 ' + d.start);
      let end = new Date('1/1/1999 ' + d.end);

      if(start >= this.afternoon.start && end <= this.afternoon.end){
        return true
      }
    })

    this.dataNight = data.filter((d:any) => {
      let start = new Date('1/1/1999 ' + d.start);
      let end = new Date('1/1/1999 ' + d.end);

      if(start >= this.night.start && end <= this.night.end){
        return true
      }
    })
  }

  changeStep(){
    if(this.objectKeys(this.hoursSelected).length > 0){
      this.reservas.sethour(this.hoursSelected)
      this.status.emit({step03: true, direction: 'forward'})
    }else{
      this.alerts.alertError(this.translate.instant('alerts.seleccionarHora'))
      return
    }
  }

  changeStepBack(){
    this.status.emit({step03: true, direction: 'back'})
  }

  alertError(msg:string, warning?:boolean){
    Swal.fire({
      icon: warning ? 'warning' : 'error',
      text: msg
    })
  }

}
