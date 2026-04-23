import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolVerification } from './vol-verification';

describe('VolVerification', () => {
  let component: VolVerification;
  let fixture: ComponentFixture<VolVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolVerification],
    }).compileComponents();

    fixture = TestBed.createComponent(VolVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
