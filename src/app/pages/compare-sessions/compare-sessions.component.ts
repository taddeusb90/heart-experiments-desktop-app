import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataStoreService } from '../../services/data-store/data-store.service';

@Component({
  selector: 'compare-sessions',
  templateUrl: './compare-sessions.component.html',
  styleUrls: ['./compare-sessions.component.scss'],
})
export class CompareSessionsComponent implements OnInit {
  public sessions: number[] = [];
  public sessionData: any[] = [];
  public sessionsInfo: any[][] = [];
  public metrics: number[][] = [];
  public predictions: number[][] = [];
  public deltas: number[][] = [];
  public maxLength: number;
  public displayedColumns: string[] = ['ind', 'batch'];
  public remainingColumns: string[] = [];
  public allColumns: string[] = [];
  private numberOfSessions: number;

  constructor(private dataStoreService: DataStoreService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params) => {
      this.sessions = params['sessions'].split(',');
    });
  }

  ngOnInit(): void {
    Promise.all(
      this.sessions.map((sessionId) => this.dataStoreService.getAggregatedSessionInfo(sessionId)),
    ).then((data) => {
      this.sessionsInfo = data.map((arr) =>
        arr.map((item, index, ar) => ({
          ...item,
          delta: index === 0 ? 0 : ar[index].average_metric - ar[index - 1].average_metric,
        })),
      );
      this.numberOfSessions = this.sessionsInfo.length;
      this.metrics = this.sessionsInfo.map((arr) => arr.map((item) => item.average_metric));
      this.predictions = this.sessionsInfo.map((arr) => arr.map((item) => item.average_prediction));
      this.deltas = this.sessionsInfo.map((arr) => arr.map((item) => item.delta));
      this.maxLength = Math.max(...this.sessionsInfo.map((items) => items.length));
      let batch = 0;
      for (let i = 0; i < this.maxLength; i++) {
        batch = 400 * i;
        const item = { batch, ind: i };
        for (let j = 0; j < this.numberOfSessions; j++) {
          if (this.sessionsInfo[j] && this.sessionsInfo[j][i]) {
            item[`${this.sessionsInfo[j][i].session_id}_average_metric`] = this.sessionsInfo[j][
              i
            ].average_metric;
            item[`${this.sessionsInfo[j][i].session_id}_delta`] = this.sessionsInfo[j][i].delta;
          } else {
            item[`${this.sessionsInfo[j][0].session_id}_average_metric`] = 0;
            item[`${this.sessionsInfo[j][0].session_id}_delta`] = 0;
          }
        }
        this.sessionData.push(item);
      }
      this.remainingColumns = Object.keys(this.sessionData[0]).filter(
        (item) => this.displayedColumns.indexOf(item) < 0,
      );

      this.allColumns = [...this.displayedColumns, ...this.remainingColumns];
    });
  }
}
