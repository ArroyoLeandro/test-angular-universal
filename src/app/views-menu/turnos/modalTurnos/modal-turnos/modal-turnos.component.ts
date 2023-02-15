import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { ModalComponent } from 'src/app/shared/modal/modal/modal.component';

@Component({
  selector: 'app-modal-turnos',
  templateUrl: './modal-turnos.component.html',
  styleUrls: ['./modal-turnos.component.css']
})
export class ModalTurnosComponent implements OnInit {

  @ViewChild('modalComponent') modal:
  | ModalComponent<ModalTurnosComponent>
  | undefined;

  staffs:any[] = []
  constructor(private reservas: ReservaService) { 
    this.getStaff()
  }

  ngOnInit(): void {
  }

  getStaff(){
    this.reservas.getStaff().subscribe(staffs => {
      this.staffs = staffs
      this.reservas.setStaffSelected(staffs[0].staff.id)
    })
  }

  selectedStaff(staff:string){
    this.reservas.setStaffSelected(staff)
  }


  async close(): Promise<void> {
    this.reservas.setStep(true)
    await this.modal?.close();
  }

}
