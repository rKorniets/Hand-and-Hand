import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsFilter } from './news-filter';

describe('NewsFilter', () => {
  let component: NewsFilter;
  let fixture: ComponentFixture<NewsFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
