import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosEquipoComponent } from './estados-equipo.component';

describe('EstadosEquipoComponent', () => {
  let component: EstadosEquipoComponent;
  let fixture: ComponentFixture<EstadosEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadosEquipoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadosEquipoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
