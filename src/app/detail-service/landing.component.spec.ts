import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { detail } from './landing.component';

describe('LandingComponent', () => {
  let component: detail;
  let fixture: ComponentFixture<detail>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ detail ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(detail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
