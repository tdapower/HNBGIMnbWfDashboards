import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KPISummaryDashboardComponent } from './kpisummary-dashboard.component';

describe('KPISummaryDashboardComponent', () => {
  let component: KPISummaryDashboardComponent;
  let fixture: ComponentFixture<KPISummaryDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KPISummaryDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KPISummaryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
