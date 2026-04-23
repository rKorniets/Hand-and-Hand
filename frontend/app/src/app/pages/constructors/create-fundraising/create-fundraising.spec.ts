import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFundraising } from './create-fundraising';

describe('CreateFundraising', () => {
  let component: CreateFundraising;
  let fixture: ComponentFixture<CreateFundraising>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFundraising],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFundraising);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
