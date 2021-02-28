import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { LineChartModule } from '../../components/line-chart/line-chart.module';
import { BackButtonModule } from '../../components/back-button/back-button.module';
import { CompareSessionsRoutingModule } from './compare-sessions-routing.module';
import { CompareSessionsComponent } from './compare-sessions.component';

@NgModule({
  declarations: [CompareSessionsComponent],
  imports: [
    CommonModule,
    CompareSessionsRoutingModule,
    MaterialModule,
    LineChartModule,
    BackButtonModule,
  ],
})
export class CompareSessionsModule {}
