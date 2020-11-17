import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CompareSessionsComponent } from './compare-sessions.component';

const routes: Routes = [
  {
    path: 'compare-sessions',
    component: CompareSessionsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompareSessionsRoutingModule {}
