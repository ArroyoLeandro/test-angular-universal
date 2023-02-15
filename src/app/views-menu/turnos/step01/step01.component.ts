import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { OlMapComponent } from 'src/app/components/ol-maps/ol-map/ol-map.component';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { StoresService } from 'src/app/services/stores/stores.service';
import { ModalTurnosComponent } from '../modalTurnos/modal-turnos/modal-turnos.component';

@Component({
  selector: 'app-step01',
  templateUrl: './step01.component.html',
  styleUrls: ['./step01.component.scss']
})
export class Step01Component implements OnInit {
  stores:any[] = []
  store:any = {}
  // map
  lat = 0;
  lng = 0;
  latTemp = 0;
  lngTemp = 0;
  zoom=13;
  @ViewChild('map') public olMap: OlMapComponent;
  markers:any[] = []
  schedules:any[] = []

  @Output() status: EventEmitter<any> = new EventEmitter()
  objectKeys = Object.keys

  // categorias
  categories:any[] = []
  services:any[] = []
  constructor(
    private modalService: ModalService<ModalTurnosComponent>,
    private reservas: ReservaService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private alerts: AlertsService,
    private storeservice: StoresService,
    private translate: TranslateService
  ) { 
    this.listenStep()
  }

  ngOnInit(): void {
    this.getStores()
  }

  listenStep(){
    this.reservas.getStep().subscribe(step => step && this.changeStep() )
  }

  getStores(){
    this.markers = []
    this.spinner.show()
    this.reservas.getStores()
    .then(res => {
      this.stores = res.data
      this.store = this.stores[0]
      this.transformSchedules(this.store.schedules)
      const {lat,lng} = JSON.parse(this.store.coordinates)
      this.lat = lat;
      this.lng = lng
      this.zoom = 7;
      this.markers = [{
        lng: lat,
        lat: lng,
        alpha: 1,
        id: this.store.id,
        domain: this.store.domain,
        openInfoWindow: true,
        title: this.store.name
      }]
      this.olMap.setView(this.lng, this.lat);
      this.getCategories(this.store.id)
      this.spinner.hide()
      this.cd.detectChanges()
    }).catch(err => {
      this.spinner.hide()
      this.alerts.alertError(this.translate.instant('alerts.salioMal'))
    })
  }

  getStore(store: string) {
    this.markers = []
    this.spinner.show();
    this.reservas
      .getDetail(store)
      .then((res) => {
        this.transformSchedules(res.data.schedules)
        this.store = res.data
        const {lat,lng} = JSON.parse(res.data.coordinates)
        this.lat = lat;
        this.lng = lng
        this.zoom = 7;
        this.markers = [{
          lng: lat,
          lat: lng,
          alpha: 1,
          id: this.store.id,
          domain: this.store.domain,
          openInfoWindow: true,
          title: this.store.name
          }]
        this.olMap.setView(this.lng, this.lat);
        this.getCategories(this.store.id)
        this.spinner.hide();
      })
      .catch((err) => {
        this.spinner.hide();
      });
  }

  changeStep(){
    this.status.emit({step01: true, direction: 'forward'})
  }

  getCategories(id_store){
    this.spinner.show()
    this.reservas.getCategory(id_store)
    .then(res => {
      this.categories = res.data
      this.assignServicesToCategory(this.categories)
      this.spinner.hide()
    })
    .catch(err => {
      this.spinner.hide()
    })
  }

  assignServicesToCategory(categories:any[]){
    let id = categories.map(c => c.id)
    id.forEach(id => this.getDetailCategorie(id))
  }


  getDetailCategorie(id:string){
    this.spinner.show()
    this.reservas.getDetailCategorie(this.store.id, id)
    .then(res => {
      this.services = res.data.services
      // con esto compruebo que servicio pertenece a cada categoria
      // como el id del servicio es igual al de la catgoria hago la validacion
      if(res.data.id == id){
        // busco la categoria actual por id y le asigno una propiedad services
        let match = this.categories.find(c => c.id === id)
        match.services = res.data.services
        this.categories.forEach(c => {
          if(c.id === id){
            c = match
          }
        })
      }
      this.cd.detectChanges()
      this.spinner.hide()
    })
    .catch(err => {
      this.spinner.hide()
    })
  }

  async open(service, category): Promise<void> {
    service.id_store = this.store.id
    this.reservas.setStaff(service.staffs)
    this.reservas.setService(service)
    this.reservas.setcategoryselected(category)
    const {ModalTurnosComponent} = await import(
      '../modalTurnos/modal-turnos/modal-turnos.component'
    );

    await this.modalService.open(ModalTurnosComponent);
  }

  transformSchedules(schedules){
    this.schedules = []
    let monday = JSON.parse(JSON.parse(schedules.monday))
    let tuesday = JSON.parse(JSON.parse(schedules.tuesday))
    let wednesday = JSON.parse(JSON.parse(schedules.wednesday))
    let thursday = JSON.parse(JSON.parse(schedules.thursday))
    let friday = JSON.parse(JSON.parse(schedules.friday))
    let saturday = JSON.parse(JSON.parse(schedules.saturday))
    let sunday = JSON.parse(JSON.parse(schedules.sunday))
    this.schedules.
      push({monday,tuesday,wednesday,thursday,friday,saturday,sunday})
  }

}
