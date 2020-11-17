import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStoreService } from '../../services/data-store/data-store.service';

@Component({
  selector: 'session-history',
  templateUrl: './session-history.component.html',
  styleUrls: ['./session-history.component.scss'],
})
export class SessionHistoryComponent implements OnInit {
  public sessions: any[] = [];

  constructor(private router: Router, private dataStoreService: DataStoreService) {}

  ngOnInit() {
    this.dataStoreService.getAllSessions().then((data) => {
      this.sessions = data;
    });
  }

  goToCompareSessions = (): void => {
    this.router.navigate(['/compare-sessions', { sessions: [3, 4] }]);
  };
}
