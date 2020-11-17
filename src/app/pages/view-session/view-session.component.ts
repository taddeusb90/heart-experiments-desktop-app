import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataStoreService } from '../../services/data-store/data-store.service';

@Component({
  selector: 'view-session',
  templateUrl: './view-session.component.html',
  styleUrls: ['./view-session.component.scss'],
})
export class ViewSessionComponent implements OnInit {
  public sessionId: number;
  public sessionInfo: any[];
  public metrics: number[];
  constructor(private dataStoreService: DataStoreService, private activatedRoute: ActivatedRoute) {
    this.sessionId = Number(activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.dataStoreService.getAggregatedSessionInfo(this.sessionId).then((data) => {
      this.sessionInfo = data;
      this.metrics = data.map((item) => item.average_metric);
    });
  }
}
