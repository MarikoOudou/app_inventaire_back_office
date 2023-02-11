import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMeubleComponent } from './list-meuble.component';

describe('ListMeubleComponent', () => {
  let component: ListMeubleComponent;
  let fixture: ComponentFixture<ListMeubleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMeubleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMeubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
