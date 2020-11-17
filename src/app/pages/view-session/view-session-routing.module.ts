import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ViewSessionComponent } from './view-session.component';

const routes: Routes = [
  {
    path: 'view-session/:id',
    component: ViewSessionComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSessionRoutingModule {}
