import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  EmbeddedViewRef,
  Type,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartService } from '../cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService<T> {
  private componentRef: ComponentRef<T> | undefined;
  componentRefCopy: BehaviorSubject<any> = new BehaviorSubject(null);
  cerrarCheckout: BehaviorSubject<Boolean> = new BehaviorSubject(false);
  type: BehaviorSubject<string> = new BehaviorSubject('');

  nameComponent: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private cartService: CartService
  ) {}

  setType(value: string) {
    this.type.next(value);
  }

  getType(): Observable<string> {
    return this.type;
  }

  setCerrar(value: boolean) {
    this.cerrarCheckout.next(value);
  }

  getCerrar(): Observable<any> {
    return this.cerrarCheckout;
  }

  async open(component: Type<T>): Promise<void> {
    if (this.componentRef) {
      return;
    }

    this.componentRef = this.componentFactoryResolver
      .resolveComponentFactory<T>(component)
      .create(this.injector);
    this.appRef.attachView(this.componentRef.hostView);
    this.componentRefCopy.next(this.componentRef);

    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

  getRef() {
    return this.componentRefCopy;
  }

  async close(): Promise<void> {
    if (!this.componentRef) {
      return;
    }

    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();

    this.componentRef = undefined;
    this.componentRefCopy.next(this.componentRef);
    this.cartService.showPopUp(false);
  }
}
