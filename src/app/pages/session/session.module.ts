import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebcamModule } from 'ngx-webcam';
import { SessionControlsComponent } from '../../components/session-controls/session-controls.component';
import { CameraComponent } from '../../components/camera/camera.component';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { MaterialModule } from '../../material.module';
import { SessionComponent } from './session.component';
import { SessionRoutingModule } from './session-routing.module';

@NgModule({
  declarations: [
    SessionComponent,
    CameraComponent,
    SessionControlsComponent,
    LineChartComponent,
  ],
  imports: [CommonModule, SessionRoutingModule, WebcamModule, MaterialModule],
})
export class SessionModule {}
