import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SessionHistoryComponent } from './session-history.component';

const routes: Routes = [
  {
    path: 'session-history',
    component: SessionHistoryComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionHistoryRoutingModule {}
