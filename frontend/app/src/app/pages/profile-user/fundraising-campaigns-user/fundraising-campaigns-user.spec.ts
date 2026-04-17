import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraisingCampaignsUser } from './fundraising-campaigns-user';

describe('FundraisingCampaignsUser', () => {
  let component: FundraisingCampaignsUser;
  let fixture: ComponentFixture<FundraisingCampaignsUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundraisingCampaignsUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundraisingCampaignsUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
