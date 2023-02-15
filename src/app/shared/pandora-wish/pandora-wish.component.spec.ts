import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PandoraWishComponentModule } from './pandora-wish.component';

describe('PandoraWishComponent', () => {
  let component: PandoraWishComponentModule;
  let fixture: ComponentFixture<PandoraWishComponentModule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PandoraWishComponentModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PandoraWishComponentModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
