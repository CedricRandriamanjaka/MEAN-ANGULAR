import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUtilisateur } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileUtilisateur;
  let fixture: ComponentFixture<ProfileUtilisateur>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileUtilisateur ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileUtilisateur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
