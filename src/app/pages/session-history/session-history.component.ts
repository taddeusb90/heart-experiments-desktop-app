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
  public selectedSessions: number[] = [];
  public displayedColumns: string[] = ['selected', 'id', 'session', 'created_at', 'items', 'view'];

  constructor(private router: Router, private dataStoreService: DataStoreService) {}

  ngOnInit(): void {
    this.dataStoreService.getAllSessions().then((data) => {
      this.sessions = data.map((item) => ({ ...item, selected: false }));
    });
  }

  goToCompareSessions = (): void => {
    this.router.navigate(['/compare-sessions', { sessions: this.selectedSessions }]);
  };

  setChange = (id: number, checked: boolean): void => {
    if (checked && this.selectedSessions.indexOf(id) < 0) this.selectedSessions.push(id);

    if (!checked && this.selectedSessions.indexOf(id) > -1)
      this.selectedSessions.splice(this.selectedSessions.indexOf(id), 1);
  };
}
