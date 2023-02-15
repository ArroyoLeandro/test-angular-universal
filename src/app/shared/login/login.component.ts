import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';
import { RecoverModalComponent } from './recover-modal/recover-modal.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Input } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
    .formLogin {
      max-height: 0;
    }
    `
  ],
  animations: [
    trigger('changeState', [
    state ('true', style({'max-height': '1000px', 'visibility': 'visible'})),
    state ('false', style({'max-height': '0', 'visibility': 'hidden'})),
    transition('false=>true', [animate('0.3s ease-in')]),
    transition('true=>false', [animate('0.3s ease-out')])
    ])
  ]
})
export class LoginComponent implements OnInit {

  login = {
    username: '',
    password: ''
  }
  error:boolean = false
  @Input() currentState;
  constructor(
    private wholesale: WholesaleService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService<RecoverModalComponent>,
    ) { 

    }

  ngOnInit(): void {
  }

  doLogin(){
    this.spinner.show()
    this.wholesale.login(this.login).then(res => {
      this.authService.setToken(res.access_token.response.data.access_token)
      this.wholesale.setVerCatalogo(false)
      this.router.navigate(['/home/wholesales'])
      this.spinner.hide()
    })
    .catch(err => {
      this.error = true
      this.spinner.hide()
    })
  }

  async open(): Promise<void> {
    const {RecoverModalComponent} = await import(
      './recover-modal/recover-modal.component'
    );

    await this.modalService.open(RecoverModalComponent);
  }

}
