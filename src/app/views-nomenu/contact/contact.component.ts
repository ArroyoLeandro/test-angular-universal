import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeService } from 'src/app/services/home/home.service';
import { NewsletterService } from 'src/app/services/newsletter/newsletter.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit, OnDestroy {

  contactForm: FormGroup
  id_store_current:string = ''
  url:string
  isAuth:boolean = false
  private subscriptions: Array<Subscription> = [];
  constructor(
    private homeservice: HomeService,
    private auth: AuthService,
    private fb: FormBuilder,
    private alerts: AlertsService,
    private newsletter: NewsletterService,
    private translate: TranslateService,
    private location: Location
  ) { 
    // this.checkAuth()
    this.contactForm = this.fb.group({
      id_store: [this.id_store_current],
      name: ['', Validators.required],
      lastname: [''],
      phone: ['', [Validators.required, Validators.pattern('^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$')]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      message: ['', Validators.required]
    })
  }

  get onlyNumbers(){
    return this.contactForm.get('phone').invalid && this.contactForm.get('phone').touched
  }

  get email(){
    return this.contactForm.get('email').invalid && this.contactForm.get('email').touched
  }

  get emailRequired(){
    return this.contactForm.get('email')
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());

  }

  send(){
    let msg = this.contactForm.get('message').value
    let email = this.contactForm.get('email').value

    if(msg.trim() == ''){
      this.alerts.alertError(this.translate.instant('validaciones.mensaje'))
      return
    }

    if(email.trim() == ''){
      this.alerts.alertError(this.translate.instant('validaciones.emailObligatorio'))
      return
    }

    this.newsletter.contacForm(this.contactForm.value)
    .then(res => {
      console.log(res)
      this.contactForm.reset()
      this.alerts.alertToastCenter(this.translate.instant('pageContact.msgExito'))
    })
    .catch(err => this.alerts.alertError(this.translate.instant('alerts.salioMal')))
  }

  back(){
    this.location.back()
  }

  // checkAuth(){
  //   this.auth.isAuthenticated() ? (this.isAuth = true) : (this.isAuth = false)  
  //   this.getImageBanner()
  // }

  // getImageBanner(){
  //   this.subscriptions.push(
  //     this.homeservice.getImage()
  //     .subscribe(img =>  this.url = img[1].url )
  //   )
  // }
  
  }