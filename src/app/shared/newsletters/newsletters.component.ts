import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NewsletterService } from 'src/app/services/newsletter/newsletter.service';
import { StoresService } from 'src/app/services/stores/stores.service';

@Component({
  selector: 'app-newsletters',
  templateUrl: './newsletters.component.html',
  styleUrls: ['./newsletters.component.css']
})
export class NewslettersComponent implements OnInit {

  id_store_current:string = ''
  form: FormGroup
  isAuth: boolean = false
  constructor(
    private newsletter: NewsletterService,
    private spinner: NgxSpinnerService,
    private stores: StoresService,
    private fb: FormBuilder,
    private alerts: AlertsService,
    private translate: TranslateService,
    private auth: AuthService,
    private cd: ChangeDetectorRef
    ) { 
      this.getId()
      this.checkAuth()
      this.form = this.fb.group({
        email: ["", Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')],
      })
     }

  ngOnInit(): void {
    
  }

  checkAuth(){
    this.auth.isAuthenticated() && (this.isAuth = true)
  }

  get email(){
    return this.form.get('email').invalid && this.form.get('email').touched
  }

  getId(){
    this.stores.getStoreId()
    .subscribe(id => id !== null && id !== "null" ? this.id_store_current = id : null )
  }


  saveEmail(){
    this.spinner.show()
    let email = this.form.get('email').value
    let data =  {
      email,
      id_store: this.id_store_current
    }
    this.newsletter.saveEmail(data)
    .then(res => {
      this.alerts.alertTopRight(this.translate.instant('alerts.emailGuardado'))
      this.form.reset()
      this.spinner.hide()
    })
    .catch(err => {
      this.form.reset()
      this.spinner.hide()
      err.state === 'fail' 
      ? this.alerts.alertError(this.translate.instant('alerts.correoExiste')) 
      : this.alerts.alertError(this.translate.instant('alerts.salioMal'))
      
    })
  }

}
