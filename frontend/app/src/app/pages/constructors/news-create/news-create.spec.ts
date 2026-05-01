import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCreateComponent } from './news-create';
describe('NewsCreateComponent', () => {
  let component: NewsCreateComponent;
  let fixture: ComponentFixture<NewsCreateComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsCreateComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(NewsCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
