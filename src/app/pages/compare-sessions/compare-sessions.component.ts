import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataStoreService } from '../../services/data-store/data-store.service';

@Component({
  selector: 'compare-sessions',
  templateUrl: './compare-sessions.component.html',
  styleUrls: ['./compare-sessions.component.scss'],
})
export class CompareSessionsComponent implements OnInit {
  sessions: number[];
  sessionsData: any[][];
  constructor(private dataStoreService: DataStoreService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params) => {
      this.sessions = params['sessions'].split(',');
    });
  }

  ngOnInit(): void {
    Promise.all(
      this.sessions.map((sessionId) => this.dataStoreService.getAggregatedSessionInfo(sessionId)),
    ).then((data) => {
      this.sessionsData = data.map((arr) => arr.map((item) => item.average_metric));
    });
  }
}
