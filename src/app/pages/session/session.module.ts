import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionRoutingModule } from './session-routing.module';
import { WebcamModule } from 'ngx-webcam';
import { SessionComponent } from './session.component';
import { CameraComponent } from '../../components/camera/camera.component';
import { MaterialModule } from '../../material.module';
import {MatIconModule} from '@angular/material/icon'
@NgModule({
  declarations: [SessionComponent, CameraComponent],
  imports: [CommonModule, SessionRoutingModule, WebcamModule,MaterialModule, MatIconModule]
})

export class SessionModule {}
