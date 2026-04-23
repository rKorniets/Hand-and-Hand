import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsConstructor } from './events-constructor';

describe('EventsConstructor', () => {
  let component: EventsConstructor;
  let fixture: ComponentFixture<EventsConstructor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsConstructor],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsConstructor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
