import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { KPISummaryDashboardComponent } from './pages/kpisummary-dashboard/kpisummary-dashboard.component';
import { AnimatedBack1Component } from './pages/animated-back-1/animated-back-1.component';

import { KpiSummaryDashboardService } from './shared/services/kpi-summary-dashboard/kpi-summary-dashboard.service';

@NgModule({
  declarations: [
    AppComponent,
    KPISummaryDashboardComponent,
    AnimatedBack1Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [KpiSummaryDashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
