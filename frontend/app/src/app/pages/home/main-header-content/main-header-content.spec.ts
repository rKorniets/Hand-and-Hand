import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainHeaderContent } from './main-header-content';

describe('MainHeaderContent', () => {
  let component: MainHeaderContent;
  let fixture: ComponentFixture<MainHeaderContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainHeaderContent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainHeaderContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
