import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReprocessSessionsComponent } from './reprocess-sessions.component';

const routes: Routes = [
  {
    path: 'reprocess-sessions',
    component: ReprocessSessionsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReprocessSessionsRoutingModule {}
