import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainInfo } from './main-info';

describe('MainInfo', () => {
  let component: MainInfo;
  let fixture: ComponentFixture<MainInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
