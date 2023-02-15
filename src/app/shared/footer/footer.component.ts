import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal/modal.service';
import { PopUpInformationComponent } from '../../shared/pop-up-information/pop-up-information.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  year = new Date().getFullYear()
  constructor(
    private modalService: ModalService<PopUpInformationComponent>,
  ) { }

  ngOnInit(): void {
  }

  async open(type:string): Promise<void> {
    this.modalService.setType(type)
    const {PopUpInformationComponent} = await import(
      '../../shared/pop-up-information/pop-up-information.component'
    );

    await this.modalService.open(PopUpInformationComponent);
    this.modalService.nameComponent.next('PopUpInformationComponent')
  }

}
