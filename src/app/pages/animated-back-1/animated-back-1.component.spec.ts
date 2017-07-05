import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedBack1Component } from './animated-back-1.component';

describe('AnimatedBack1Component', () => {
  let component: AnimatedBack1Component;
  let fixture: ComponentFixture<AnimatedBack1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatedBack1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedBack1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
