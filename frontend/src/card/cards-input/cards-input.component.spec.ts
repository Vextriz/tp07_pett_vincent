import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsInputComponent } from './cards-input.component';

describe('CardsInputComponent', () => {
  let component: CardsInputComponent;
  let fixture: ComponentFixture<CardsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
