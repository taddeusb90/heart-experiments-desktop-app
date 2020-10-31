import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
  constructor(private router: Router) {}

  goToSessionHistory = (): void => {
    this.router.navigate(['session-history']);
  };

  goToRecordSession = (): void => {
    this.router.navigate(['compare-sessions']);
  };
}
