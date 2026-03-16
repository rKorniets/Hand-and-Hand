import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFooterContent } from './main-footer-content';

describe('MainFooterContent', () => {
  let component: MainFooterContent;
  let fixture: ComponentFixture<MainFooterContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainFooterContent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainFooterContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
