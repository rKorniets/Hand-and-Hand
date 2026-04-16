import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgData } from './org-data';

describe('OrgData', () => {
  let component: OrgData;
  let fixture: ComponentFixture<OrgData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
