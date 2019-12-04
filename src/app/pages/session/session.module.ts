import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionRoutingModule } from './session-routing.module';
import { WebcamModule } from 'ngx-webcam';
import { SessionComponent } from './session.component';
import { CameraComponent } from '../../components/camera/camera.component';

@NgModule({
  declarations: [SessionComponent, CameraComponent],
  imports: [CommonModule, SessionRoutingModule, WebcamModule]
})

export class SessionModule {}
