import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionRoutingModule } from './session-routing.module';
import { WebcamModule } from 'ngx-webcam';
import { SessionComponent } from './session.component';
import { SessionControlsComponent } from '../../components/session-controls/session-controls.component';
import { CameraComponent } from '../../components/camera/camera.component';
import { MaterialModule } from '../../material.module';
@NgModule({
  declarations: [SessionComponent, CameraComponent, SessionControlsComponent],
  imports: [CommonModule, SessionRoutingModule, WebcamModule,MaterialModule]
})

export class SessionModule {}
