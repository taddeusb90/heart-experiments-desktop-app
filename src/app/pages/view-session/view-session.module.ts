import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { LineChartModule } from '../../components/line-chart/line-chart.module';
import { ViewSessionRoutingModule } from './view-session-routing.module';
import { ViewSessionComponent } from './view-session.component';

@NgModule({
  declarations: [ViewSessionComponent],
  imports: [CommonModule, ViewSessionRoutingModule, MaterialModule, LineChartModule],
})
export class ViewSessionModule {}