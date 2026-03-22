import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesOrg } from './categories-org';

describe('CategoriesOrg', () => {
  let component: CategoriesOrg;
  let fixture: ComponentFixture<CategoriesOrg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesOrg],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesOrg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
