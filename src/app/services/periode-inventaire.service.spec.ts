import { TestBed } from '@angular/core/testing';

import { PeriodeInventaireService } from './periode-inventaire.service';

describe('PeriodeInventaireService', () => {
  let service: PeriodeInventaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodeInventaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
