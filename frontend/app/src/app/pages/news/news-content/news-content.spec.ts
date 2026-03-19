import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsContent } from './news-content';

describe('NewsContent', () => {
  let component: NewsContent;
  let fixture: ComponentFixture<NewsContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
