import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderContent } from './header-content';

describe('HeaderContent', () => {
  let component: HeaderContent;
  let fixture: ComponentFixture<HeaderContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
