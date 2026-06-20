import { TestBed } from '@angular/core/testing';

import { EstadoEquipoService } from './estado-equipo.service';

describe('EstadoEquipoService', () => {
  let service: EstadoEquipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoEquipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
