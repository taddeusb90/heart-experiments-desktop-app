import {Component} from '@angular/core';
import { CameraService } from '../../services/camera/camera.service';
import { MatIconRegistry } from '@angular/material/icon';
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent {
 
  constructor(public cameraService: CameraService) {}

 




}
