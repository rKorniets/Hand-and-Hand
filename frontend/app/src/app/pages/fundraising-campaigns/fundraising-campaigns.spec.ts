import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraisingCampaigns } from './fundraising-campaigns';

describe('FundraisingCampaigns', () => {
  let component: FundraisingCampaigns;
  let fixture: ComponentFixture<FundraisingCampaigns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundraisingCampaigns],
    }).compileComponents();

    fixture = TestBed.createComponent(FundraisingCampaigns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
