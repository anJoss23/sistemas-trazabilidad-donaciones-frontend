import { TestBed } from '@angular/core/testing';

import { DonanteService } from './donante.service';

describe('DonanteService', () => {
  let service: DonanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
