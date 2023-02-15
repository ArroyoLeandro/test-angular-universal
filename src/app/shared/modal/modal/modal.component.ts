import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent<T> implements OnInit, OnDestroy {
  display = true;
  componentname: string = '';
  alert: boolean = false;

  private $close_obs: Subscription = new Subscription();
  private subscriptions: Array<Subscription> = [];

  constructor(
    private alerts: AlertsService,
    private modalService: ModalService<T>,
    private cartService: CartService
  ) {
    this.listenClose();
    this.listenNameComponent();
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.componentname = '';
    this.alert = false;
    this.$close_obs.unsubscribe();
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }

  listenNameComponent() {
    this.subscriptions.push(
      this.modalService.nameComponent.subscribe((value: string) => {
        // console.log('=> ', value);
        this.componentname = value;
      })
    );
  }

  listenClose() {
    this.$close_obs.add(
      this.modalService
        .getCerrar()
        .subscribe((val: boolean) => val && (this.alert = true))
    );
  }

  async close(showPopUp?: boolean): Promise<void> {
    this.modalService
      .getCerrar()
      .subscribe((val: boolean) => (this.alert = val));
    if (this.alert) {
      this.alerts.loseInfo().then((result) => {
        if (result.value) {
          this.display = false;
          setTimeout(async () => {
            await this.modalService.close();
            this.alert = false;
            showPopUp && this.cartService.showPopUp(true);
          }, 300);
        }
      });
    } else {
      this.display = false;

      setTimeout(async () => {
        await this.modalService.close();
        this.alert = false;
        showPopUp && this.cartService.showPopUp(true);
      }, 300);
    }
  }
}
