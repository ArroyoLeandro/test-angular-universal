import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styles: [
  ]
})
export class PasswordComponent implements OnInit {
  token:string
  data = {
    token: '',
    password: ''
  }
  constructor(
    private route: ActivatedRoute,
    private wholeservice: WholesaleService,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService
    ) { this.getTokenFromUrl() }

  ngOnInit(): void {
  }

  getTokenFromUrl(){
    this.token = this.route.snapshot.paramMap.get('token')
    this.data.token = this.token
  }


  send(){
    this.spinner.show()
    this.wholeservice.setPassword(this.data)
    .then(res => {
      console.log(res)
      this.authService.setToken(res.data)
      this.router.navigate(['/home/wholesales'])
      this.spinner.hide()
    })
    .catch(err => {
      console.log(err)
      this.alerts.alertError(this.translate.instant('alerts.salioMal'))
      this.spinner.hide()
    })
  }

}
