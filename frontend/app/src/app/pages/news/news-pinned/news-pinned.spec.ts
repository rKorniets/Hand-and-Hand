import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsPinned } from './news-pinned';

describe('NewsPinned', () => {
  let component: NewsPinned;
  let fixture: ComponentFixture<NewsPinned>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsPinned]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsPinned);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
