import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnicosComponent } from './tecnicos.component';

describe('TecnicosComponent', () => {
  let component: TecnicosComponent;
  let fixture: ComponentFixture<TecnicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TecnicosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
