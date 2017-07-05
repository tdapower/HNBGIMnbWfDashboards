import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { KpiSummaryDashboardService } from '../../shared/services/kpi-summary-dashboard/kpi-summary-dashboard.service';

import { IKPISummaryDashboard } from '../../shared/models/kPISummaryDashboard.model';



@Component({
  selector: 'app-kpisummary-dashboard',
  templateUrl: './kpisummary-dashboard.component.html',
  styleUrls: ['./kpisummary-dashboard.component.css']
})




export class KPISummaryDashboardComponent implements OnInit {

  RInhScruJobTtlTime: number = 0;
  RInhPrcoJobTtlTime: number = 0;
  RInhValJobTtlTime: number = 0;
  RCompScruJobTtlTime: number = 0;
  RCompPrcoJobTtlTime: number = 0;
  RCompValJobTtlTime: number = 0;
  RCompletedScruJobCount: number = 0;
  RInHandScruJobCount: number = 0;
  RCompletedProcJobCount: number = 0;
  RInHandProcJobCount: number = 0;
  RCompletedValiJobCount: number = 0;
  RInHandValiJobCount: number = 0;
  RAvgInhScruJobTtlTime: number = 0;
  RAvgInhPrcoJobTtlTime: number = 0;
  RAvgInhValJobTtlTime: number = 0;
  RAvgCompScruJobTtlTime: number = 0;
  RAvgCompPrcoJobTtlTime: number = 0;
  RAvgCompValJobTtlTime: number = 0;
  RSumryCompJobCount: number = 0;
  RSumryCompTtlTime: number = 0;
  RSumryInhJobCount: number = 0;
  RSumryInhTtlTime: number = 0;
  RSumryAvgCompJobCount: number = 0;
  RSumryAvgInhTtlTime: number = 0;
  RSumryCompJobCountWw: number = 0;
  RSumryCompTtlTimeWw: number = 0;
  RSumryInhJobCountWw: number = 0;
  RSumryInhTtlTimeWw: number = 0;
  RSumryAvgInhJobCountWw: number = 0;
  RSumryAvgInhTtlTimeWw: number = 0;

  constructor(private kpiSummaryDashboardService: KpiSummaryDashboardService) {

    this.loadDashboardData();
    Observable.interval(1000 * 60).subscribe(x => {
      this.loadDashboardData();
    });



  }

  ngOnInit() {
  }


  loadDashboardData() {

    this.kpiSummaryDashboardService.getKPISummaryDashboards()
      .subscribe((data) => {
      


        let obj: IKPISummaryDashboard = JSON.parse(data);


        this.RInhScruJobTtlTime = obj.RInhScruJobTtlTime;
        this.RInhPrcoJobTtlTime = obj.RInhPrcoJobTtlTime;
        this.RInhValJobTtlTime = obj.RInhValJobTtlTime;
        this.RCompScruJobTtlTime = obj.RCompScruJobTtlTime;
        this.RCompPrcoJobTtlTime = obj.RCompPrcoJobTtlTime;
        this.RCompValJobTtlTime = obj.RCompValJobTtlTime;
        this.RCompletedScruJobCount = obj.RCompletedScruJobCount;
        this.RInHandScruJobCount = obj.RInHandScruJobCount;
        this.RCompletedProcJobCount = obj.RCompletedProcJobCount;
        this.RInHandProcJobCount = obj.RInHandProcJobCount;
        this.RCompletedValiJobCount = obj.RCompletedValiJobCount;
        this.RInHandValiJobCount = obj.RInHandValiJobCount;
        this.RAvgInhScruJobTtlTime = obj.RAvgInhScruJobTtlTime;
        this.RAvgInhPrcoJobTtlTime = obj.RAvgInhPrcoJobTtlTime;
        this.RAvgInhValJobTtlTime = obj.RAvgInhValJobTtlTime;
        this.RAvgCompScruJobTtlTime = obj.RAvgCompScruJobTtlTime;
        this.RAvgCompPrcoJobTtlTime = obj.RAvgCompPrcoJobTtlTime;
        this.RAvgCompValJobTtlTime = obj.RAvgCompValJobTtlTime;
        this.RSumryCompJobCount = obj.RSumryCompJobCount;
        this.RSumryCompTtlTime = obj.RSumryCompTtlTime;
        this.RSumryInhJobCount = obj.RSumryInhJobCount;
        this.RSumryInhTtlTime = obj.RSumryInhTtlTime;
        this.RSumryAvgCompJobCount = obj.RSumryAvgCompJobCount;
        this.RSumryAvgInhTtlTime = obj.RSumryAvgInhTtlTime;
        this.RSumryCompJobCountWw = obj.RSumryCompJobCountWw;
        this.RSumryCompTtlTimeWw = obj.RSumryCompTtlTimeWw;
        this.RSumryInhJobCountWw = obj.RSumryInhJobCountWw;
        this.RSumryInhTtlTimeWw = obj.RSumryInhTtlTimeWw;
        this.RSumryAvgInhJobCountWw = obj.RSumryAvgInhJobCountWw;
        this.RSumryAvgInhTtlTimeWw = obj.RSumryAvgInhTtlTimeWw;

      },
      (err) => {

        console.log(err);

      });
  }
}
