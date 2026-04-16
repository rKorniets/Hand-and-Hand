import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOrganization } from './profile-organization';

describe('ProfileOrganization', () => {
  let component: ProfileOrganization;
  let fixture: ComponentFixture<ProfileOrganization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileOrganization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileOrganization);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
