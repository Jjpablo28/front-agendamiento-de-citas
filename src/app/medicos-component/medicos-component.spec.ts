import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicosComponent } from './medicos-component';

describe('MedicosComponent', () => {
  let component: MedicosComponent;
  let fixture: ComponentFixture<MedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
