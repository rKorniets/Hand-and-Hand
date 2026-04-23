import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSubmitted } from './application-submitted';

describe('ApplicationSubmitted', () => {
  let component: ApplicationSubmitted;
  let fixture: ComponentFixture<ApplicationSubmitted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationSubmitted],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationSubmitted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
