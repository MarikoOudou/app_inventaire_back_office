import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodeInventaireComponent } from './periode-inventaire.component';

describe('PeriodeInventaireComponent', () => {
  let component: PeriodeInventaireComponent;
  let fixture: ComponentFixture<PeriodeInventaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodeInventaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodeInventaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
