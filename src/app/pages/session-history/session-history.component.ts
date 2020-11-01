import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { DataStoreService } from '../../services/data-store/data-store.service';
@Component({
  selector: 'session-history',
  templateUrl: './session-history.component.html',
  styleUrls: ['./session-history.component.scss'],
})
export class SessionHistoryComponent implements OnInit {
  public sessions: any[] = [];

  constructor(private dataStoreService: DataStoreService) {}

  ngOnInit() {
    setTimeout(() => {
      this.dataStoreService.getAllSessions().then((data) => {
        this.sessions = data;
      });
    }, 1000);
  }
}
