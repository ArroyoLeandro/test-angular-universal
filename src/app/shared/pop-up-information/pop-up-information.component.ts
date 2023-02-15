import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeService } from 'src/app/services/home/home.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { StoresService } from 'src/app/services/stores/stores.service';
import { ModalComponent } from '../modal/modal/modal.component';

@Component({
  selector: 'app-pop-up-information',
  templateUrl: './pop-up-information.component.html',
  styles: [
  ]
})
export class PopUpInformationComponent implements OnInit, OnDestroy {
  @ViewChild('modalComponent') modal:
  | ModalComponent<PopUpInformationComponent>
  | undefined;
  type:string = ''
  private subscriptions: Array<Subscription> = [];
  terms:string = ''
  privacy:string = ''
  about:string = ''
  store:boolean = true
  constructor(
    private modalService: ModalService<any>,
    private stores: StoresService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private homeService: HomeService,
  ) { 
    this.router.url === '/' ? (this.store = false) : (this.store = true)
    this.listenType()
    this.router.url !== '/' && this.getConfigStore()
  }

  ngOnInit(): void {
    !this.store && (this.getConfig())
  }

  getConfig(){
    this.subscriptions.push()
    this.homeService.getConfGeneralObs$()
    .subscribe(config => {
      config.map(({name, value}) => {
        // console.log(name)
        name === 'terms-gen' && (this.terms = value)
      })
    })
  }

  processHTML(html:any){
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  
  listenType(){
    this.subscriptions.push(
      this.modalService.getType()
      .subscribe(value => this.type = value)
    )
  }

  getConfigStore(){
    this.stores.getAllConfig()
    .subscribe((config:any[]) => {
      config.map(({name, value}) => {
        name === 'terms-and-conditions' && (this.terms = value)
        name === 'privacy-policies' && (this.privacy = value)
        name === 'about' && (this.about = value)
      })
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  async close(): Promise<void> {
    await this.modal?.close();
  }

}
