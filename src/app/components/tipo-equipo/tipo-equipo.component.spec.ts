import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEquipoComponent } from './tipo-equipo.component';

describe('TipoEquipoComponent', () => {
  let component: TipoEquipoComponent;
  let fixture: ComponentFixture<TipoEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoEquipoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoEquipoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
