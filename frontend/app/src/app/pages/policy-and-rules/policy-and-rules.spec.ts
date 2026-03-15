import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyAndRules } from './policy-and-rules';

describe('PolicyAndRules', () => {
  let component: PolicyAndRules;
  let fixture: ComponentFixture<PolicyAndRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyAndRules],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyAndRules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
