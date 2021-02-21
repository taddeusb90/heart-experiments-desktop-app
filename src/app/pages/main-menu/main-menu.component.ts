import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataStoreService } from '../../services/data-store/data-store.service';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
  constructor(private router: Router, private dataSource: DataStoreService) {}

  goToSessionHistory = (): void => {
    this.router.navigate(['session-history']);
  };

  goToRecordSession = (): void => {
    this.router.navigate(['session']);
  };

  goToReprocessSessions = (): void => {
    this.router.navigate(['reprocess-sessions']);
  };

  goToInformation = (): void => {
    this.router.navigate(['info']);
  };
}
