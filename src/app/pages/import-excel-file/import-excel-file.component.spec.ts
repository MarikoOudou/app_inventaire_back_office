import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExcelFileComponent } from './import-excel-file.component';

describe('ImportExcelFileComponent', () => {
  let component: ImportExcelFileComponent;
  let fixture: ComponentFixture<ImportExcelFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportExcelFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportExcelFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
