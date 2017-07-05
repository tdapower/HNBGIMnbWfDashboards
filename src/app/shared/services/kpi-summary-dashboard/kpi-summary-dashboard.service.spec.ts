import { TestBed, inject } from '@angular/core/testing';

import { KpiSummaryDashboardService } from './kpi-summary-dashboard.service';

describe('KpiSummaryDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KpiSummaryDashboardService]
    });
  });

  it('should ...', inject([KpiSummaryDashboardService], (service: KpiSummaryDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
