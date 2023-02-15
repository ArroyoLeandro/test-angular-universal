import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';
import { ModalComponent } from '../../modal/modal/modal.component';

@Component({
  selector: 'app-recover-modal',
  templateUrl: './recover-modal.component.html',
  styles: [
  ]
})
export class RecoverModalComponent implements OnInit {
  data = {
    username: ''
  }
  @ViewChild('modalComponent') modal:
  | ModalComponent<RecoverModalComponent>
  | undefined;

  constructor(
    private wholeservice: WholesaleService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private alerts: AlertsService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

  send(){
    this.spinner.show()
    this.wholeservice.recoverPassword(this.data)
    .then(res => {
      this.spinner.hide()
      this.alerts.alertToastCenter(this.translate.instant('alerts.emailEnviado'))
      // this.router.navigate([`/wholesales/user-activate/${res.data}`])
      this.close()
    })
    .catch(err => {
      err.data == 338 ? this.alerts.alertError(this.translate.instant('alerts.userInactivo')) : this.alerts.alertError(this.translate.instant('alerts.salioMal'))
      this.spinner.hide()
    })
  }

  async close(): Promise<void> {
    await this.modal?.close();
  }

}
