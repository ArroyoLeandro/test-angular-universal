import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';

@Component({
  selector: 'recover-profile',
  templateUrl: './recover.component.html',
  styles: [
  ]
})
export class RecoverComponent implements OnInit {
  data = {
    username: ''
  }
  constructor(
    private wholeservice: WholesaleService,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  send(){
    this.spinner.show()
    this.wholeservice.recoverPassword(this.data)
    .then(res => {
      this.spinner.hide()
      this.router.navigate([`/user-activate/${res.data}`])
    })
    .catch(err => {
      console.log(err)
      this.spinner.hide()
      this.alerts.alertError('Ha ocurrido un error, intente nuevamente')
    })
  }

}
