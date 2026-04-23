import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraisingCampaignsDetail } from './fundraising-campaigns-detail';

describe('FundraisingCampaignsDetail', () => {
  let component: FundraisingCampaignsDetail;
  let fixture: ComponentFixture<FundraisingCampaignsDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundraisingCampaignsDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(FundraisingCampaignsDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
