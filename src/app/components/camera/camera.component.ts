import { Component } from '@angular/core';
import { CameraService } from '../../services/camera/camera.service';
import { SpectrometerService } from '../../services/spectrometer/spectrometer.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent {
  public spectroMetric: number;
  constructor(public cameraService: CameraService, spectrometerService: SpectrometerService) {
    setTimeout(() => {
      // eslint-disable-next-line prefer-destructuring
      const video = document.getElementsByTagName('video')[0];
      video.style.position = 'absolute';
      video.style.width = '751px';
      video.style.height = '394px';
      video.style.margin = '-36px 0px 0px -101px';
    }, 2000);

    spectrometerService.spectroMetricObservable.subscribe((spectroMetric) => {
      this.spectroMetric = spectroMetric;
    });
  }
}
