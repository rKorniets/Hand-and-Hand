import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraisingCampaignsOrg } from './fundraising-campaigns-org';

describe('FundraisingCampaignsOrg', () => {
  let component: FundraisingCampaignsOrg;
  let fixture: ComponentFixture<FundraisingCampaignsOrg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundraisingCampaignsOrg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundraisingCampaignsOrg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
