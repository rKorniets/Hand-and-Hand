import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestConstructor } from './request-constructor';

describe('RequestConstructor', () => {
  let component: RequestConstructor;
  let fixture: ComponentFixture<RequestConstructor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestConstructor],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestConstructor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
