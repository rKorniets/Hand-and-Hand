import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrg } from './list-org';

describe('ListOrg', () => {
  let component: ListOrg;
  let fixture: ComponentFixture<ListOrg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOrg],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOrg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
