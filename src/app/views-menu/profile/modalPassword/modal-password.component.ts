import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';
import { ModalComponent } from 'src/app/shared/modal/modal/modal.component';

@Component({
  selector: 'app-modal-password',
  templateUrl: './modal-password.component.html',
  styles: [
  ]
})
export class ModalPasswordComponent implements OnInit {

  @ViewChild('modalComponent') modal:
  | ModalComponent<ModalPasswordComponent>
  | undefined;

  data = {
    password: '',
    password2: ''
  }

  constructor(
    private wholesale: WholesaleService,
    private alerts: AlertsService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

  
  checkPassword():Boolean {
    if(this.data.password !== this.data.password2){
      this.alerts.alertError('Las contraseñas deben ser iguales')
      return false
    }

    if(this.data.password.length < 8 || this.data.password2.length < 8){
      this.alerts.alertError('Las contraseñas ser de al menos 8 caracteres ')
      return false
    }
    return true
  }

  send(){
    if(this.checkPassword()){
      this.spinner.show()
      this.wholesale.changePassword(this.data)
      .then(res => {
        this.spinner.hide()
        this.close()
        this.alerts.alertTopRight(this.translate.instant('alerts.passUpdate'))
      })
      .catch(err => {
        console.log(err)
        this.spinner.hide()
        this.alerts.alertError(this.translate.instant('alerts.salioMal'))
      })
    }
    
   
  }

  async close(): Promise<void> {
    await this.modal?.close();
  }

}
