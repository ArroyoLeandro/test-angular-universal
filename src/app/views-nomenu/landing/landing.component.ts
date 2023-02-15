import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeService } from 'src/app/services/home/home.service';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { StoresService } from 'src/app/services/stores/stores.service';
import { OlMapComponent } from 'src/app/components/ol-maps/ol-map/ol-map.component';
import { HttpService } from 'src/app/services/http/http.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PopUpInformationComponent } from '../../shared/pop-up-information/pop-up-information.component';
import { ModalService } from 'src/app/services/modal/modal.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  datosLanding:any = {}
  catalogo:any = {}
  objectKeys = Object.keys;
  isBrowser:boolean = false
  year = new Date().getFullYear()
  map: Map
  stores:any[] = []
  markers:any[] = []
  tiendas_cercanas:any[] = []
  lat = 4.696788;
  lng = -74.0796657;
  latTemp = 4.696788;
  lngTemp = -74.0796657;
  zoom = 13


  @ViewChild('map')
  public olMap: OlMapComponent;
  phoneNumber: number | any = '+54 9 11 57515008'
  api_whatsapp:string = 'https://api.whatsapp.com/send?'
  msg:string = '¡Hola! Quisiera conversar con Flexy'

  constructor(
    @Inject(PLATFORM_ID) private platformID,
    private homeService: HomeService,
    private sanitizer: DomSanitizer,
    private storesService: StoresService,
    private httpService: HttpService,
    private translate: TranslateService,
    private router: Router,
    private modalService: ModalService<PopUpInformationComponent>,
  ) {  
      // esto es para el server side rendering
      this.isBrowser = isPlatformBrowser(platformID)
  }

  ngOnInit(): void {
    this.getDataHome()
    this.getCatalogo()
    this.getListStores()
  }

  getDataHome(){
    this.homeService.getLanding()
    .then(res => {
      // console.log(JSON.parse(res.data.home))
      if(res.data.home !== null) this.datosLanding = JSON.parse(res.data.home)
      else this.datosLanding = {}
    })
    .catch(err => this.datosLanding = {} )
  }

  getCatalogo(){
    this.homeService.getCatalogo()
    .then(res => {
      this.catalogo = this.sanitizer.bypassSecurityTrustResourceUrl(`https://heyzine.com/api1?pdf=${res.data}&k=15f969179a496d8b&st=0&bg=989693`)
    }).catch(err => this.catalogo = '' )
  }

  processHTML(html:any){
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  
  // esto es para mostrar el mapa - inicio

  getListStores(){

    this.storesService.getList()
    .then(res => {
      this.stores = res.data
      this.stores.forEach(store => {
        var coord = JSON.parse(store.coordinates)

        this.markers.
        push({
          lng: coord.lat,
          lat: coord.lng,
          alpha: 1,
          id: store.id,
          domain: store.domain,
          openInfoWindow: true,
          title: store.name
        })
        
      });

      this.tiendasCercanas()
      this.setCurrentLocation()
    })
    .catch(err => {
    })


  }

  tiendasCercanas(){
    let distance = 999999999

    this.stores.forEach(store => {
      let coord = JSON.parse(store.coordinates)
      let val = this.Dist(this.latTemp,this.lngTemp, coord.lng, coord.lat)
      if(val <= distance){
        if(this.stores.length === this.tiendas_cercanas.length){
          this.tiendas_cercanas = this.tiendas_cercanas.map(tienda => {
            return {
              ...tienda,
              distance: this.Dist(this.latTemp, this.lngTemp, tienda.lng, tienda.lat)
            }
          })
        }else{
          this.tiendas_cercanas
          .push({
            lng: coord.lat,
            lat: coord.lng,
            alpha: 1,
            id: store.id,
            domain: store.domain,
            openInfoWindow: true,
            title: store.name,
            distance: this.Dist(this.latTemp, this.lngTemp, coord.lng, coord.lat)
          })
        }
      }
    });

    this.tiendas_cercanas = this.tiendas_cercanas.sort( (a,b) => a.distance - b.distance ).slice(0,6)
    
  }

  setCurrentLocation(){

    if(isPlatformBrowser(this.platformID)){
      if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition( position => {
          this.lat = position.coords.latitude
          this.lng = position.coords.longitude
          this.latTemp = position.coords.latitude;
          this.lngTemp = position.coords.longitude;
          this.zoom = 14
          this.olMap.setView(this.lat, this.lng);
        })
      }
    }

  }

  rad = function(x) {
    return x * Math.PI / 180;
  }

  Dist(lat1, lon1, lat2, lon2)
  {
    var R     = 6378.137;                          //Radio de la tierra en km
    var dLat  = this.rad( lat2 - lat1 );
    var dLong = this.rad( lon2 - lon1 );

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return parseFloat (d.toFixed(3));                      //Retorna tres decimales
  }

  public procesarData(data:any){
    this.centerChanged(data[1],data[0]);
  }

  centerChanged(lat,lng) {
    this.latTemp =lat;
    this.lngTemp = lng;

    this.tiendasCercanas();
  }

  // esto es para mostrar el mapa - fin


  // esto es para buscar las tiendas y evento de click al marker - inicio 


  searchMap(text:string){
    this.httpService.getExternal(`https://nominatim.openstreetmap.org/search?q=colombia+%2C+${text}&format=geojson`)
    .then(res => {
      if(res.data.length > 0){
        let coord = res.data[0].geometry.coordinates
        this.olMap.setView(coord[1], coord[0]);
      }
    })
  }

  selectMarker(item){
    this.router.navigate([`/${item.id}`])
  }


  // esto es para buscar las tiendas y evento de click al marker - fin 

    // open modals
  
  async open(): Promise<void> {
    this.modalService.setType('terms')
    const {PopUpInformationComponent} = await import(
      '../../shared/pop-up-information/pop-up-information.component'
    );

    await this.modalService.open(PopUpInformationComponent);
    this.modalService.nameComponent.next('PopUpInformationComponent')
  }

  // fin open modals

  // logic ws

  contactWhatsapp(){
    let url = `${this.api_whatsapp}phone=+${this.phoneNumber}&text=${this.msg}`
    let link = document.createElement("a")
    link.href = url
    link.target = "_blank"
    link.dispatchEvent(new MouseEvent("click"))
  }

  // fin ws

}
