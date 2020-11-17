import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
import { SessionControlsComponent } from '../../components/session-controls/session-controls.component';
import { CameraComponent } from '../../components/camera/camera.component';
import { MaterialModule } from '../../material.module';
import { LineChartModule } from '../../components/line-chart/line-chart.module';
import { SessionComponent } from './session.component';
import { SessionRoutingModule } from './session-routing.module';

@NgModule({
  declarations: [SessionComponent, CameraComponent, SessionControlsComponent],
  imports: [CommonModule, SessionRoutingModule, WebcamModule, MaterialModule, LineChartModule],
})
export class SessionModule {}
