import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoraireEmployeComponent } from './horaire-employe.component';

describe('HoraireEmployeComponent', () => {
  let component: HoraireEmployeComponent;
  let fixture: ComponentFixture<HoraireEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoraireEmployeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoraireEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
