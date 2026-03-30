import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFundraisingCampaigns } from './list-fundraising-campaigns';

describe('ListFundraisingCampaigns', () => {
  let component: ListFundraisingCampaigns;
  let fixture: ComponentFixture<ListFundraisingCampaigns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFundraisingCampaigns],
    }).compileComponents();

    fixture = TestBed.createComponent(ListFundraisingCampaigns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
