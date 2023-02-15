import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private translate: TranslateService) { }

  alertTopRight(msg:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    })

    Toast.fire({
      icon: 'success',
      iconColor: 'white',
      background: '#960E2B',
      title: `<p class="text-white text-lg font-normal">${msg}</p>`
    })
  }


  alertToastCenter(msg:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
    })

    Toast.fire({
      icon: 'success',
      iconColor: 'white',
      background: '#960E2B',
      padding: '1rem 2rem',
      title: `<p class=text-white>${msg}</p>`
    })
  }


  alertError(msg: string){
    Swal.fire({
      text: `${msg}`,
      icon: 'error'
    })
  }

  confirmAddress(provincia, ciudad,street,destinatario){
    return  Swal.fire({
      title: this.translate.instant('alerts.confirmarDireccion'),
      html: `${provincia} - ${ciudad} <br> ${street} <br> ${destinatario}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ffcad4',
      cancelButtonColor: '#00000096',
      cancelButtonText:this.translate.instant('buttons.cancelar'),
      confirmButtonText: this.translate.instant('buttons.aceptar')
    })
  }

  loseInfo(){
    return Swal.fire({
      text: this.translate.instant('alerts.textLose'),
      titleText: this.translate.instant('alerts.titleLose'),
      icon:'warning',
      showCancelButton: true,
      confirmButtonColor: 'succes',
      cancelButtonColor: '#00000096',
      cancelButtonText:this.translate.instant('buttons.cancelar'),
      confirmButtonText: this.translate.instant('buttons.aceptar')
    })
  }

}
