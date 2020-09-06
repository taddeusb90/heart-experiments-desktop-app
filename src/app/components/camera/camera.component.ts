import { Component } from '@angular/core';
import { CameraService } from '../../services/camera/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent {
  constructor(public cameraService: CameraService) {
    setTimeout(() => {
      // eslint-disable-next-line prefer-destructuring
      const video = document.getElementsByTagName('video')[0];
      video.style.position = 'absolute';
      video.style.width = '1000px';
      video.style.height = '500px';
      video.style.margin = '-62px 0 0 -167px';
    }, 2000);
  }
}
