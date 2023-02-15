import { ChangeDetectorRef, Component, Inject, Input, OnInit, HostListener, ElementRef, ViewChild, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StoresService } from 'src/app/services/stores/stores.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import { ToggleClassService } from '../../services/toggle/toggle-class.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  phoneNumber: number | any
  api_whatsapp:string = 'https://api.whatsapp.com/send?'
  msg:string = '¡Hola! Quisiera conversar con una asesora'
  id_store_current : string = ''
  cartCount = 0
  isAuth:boolean = false
  slug:string = ''
  logo:string = ''
  private debounceTimer?: NodeJS.Timeout
  searchTerm:string = ''
  text:string = ''
  list:any[] = []
  default_photo: string = "https://puu.sh/ImNRs/0ab1b352dc.png";
  show:boolean = false
  searchReady:boolean = false
  //header variable
  headerType:string = ''
  menuAbierto:boolean = false
  //saber si desborda el contenedor
  //desborda:boolean
  @Input() isMobile:boolean
  @Input() categories:any[]
  selected: any = {};

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformID,
    public router: Router,
    private stores: StoresService,
    public toggleService: ToggleClassService
  ) {

  }

  ngOnInit(): void {
    this.mostrarMenu()
    this.checkAuth()
  }

  @HostListener('window:keydown', ['$event'])
  escapeEvent(event: any) {
    if(event.keyCode == 27 && this.toggleService.comprimida) this.toggleService.comprimida = false
  }


  mostrarMenu(){
  //mido el contenedor
    let widthContent = document.documentElement.clientWidth;
    if (widthContent <= 640) {
      this.isMobile = true
      this.toggleService.comprimida = true
    }
    else {
      this.isMobile = false
      this.toggleService.comprimida = false
    }

  }

  select(type, item, $event?) {
    this.selected[type] = (this.selected[type] === item ? null : item);
    $event ? $event.stopPropagation() : null;
  }

  isActive(type, item) {
    return this.selected[type] === item;
  }

  toggleCtg(category){
    // category.show = !category.show
    this.categories.map(catg => {
      category.id === catg.id ? (catg.show = !catg.show) : (catg.show = false)
    })
  }


  checkAuth(){
    this.getId()
    this.getLogo()
  }

  getLogo(){
    this.stores.getLogo()
    .subscribe(logo => this.logo = logo)
  }

  getId(){
    this.stores.getStoreId()
    .subscribe(async id => {
      if(id !== null && id !== "null"){
        this.id_store_current = id
      }
    })
  }


  abrirMenu() {
  this.menuAbierto = !this.menuAbierto
  //this.cambiarTabindex();
  }

  hideMenu(){
    this.menuAbierto = false
  }

 

  redirectCtg(slug:string, ctg, sub:boolean){
    this.toggleService.comprimida = false
    !sub && this.router.navigate([`/${this.id_store_current}/${slug}`])
    sub && this.router.navigate([`/${this.id_store_current}/${ctg.slug}/${slug}`])
    // status ? this.router.navigate([`/home/wholesales/${slug}`]) : this.router.navigate([`/home/${slug}`])
  }
  // '/home/wholesales/{{category.slug}}' : '/home/{{category.slug}}'

}
