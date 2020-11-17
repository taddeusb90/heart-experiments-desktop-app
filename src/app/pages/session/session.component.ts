import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { GraphService } from '../../services/graph/graph.service';
import { SessionService } from '../../services/session/session.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent {
  public webcamImage: WebcamImage = null;
  public dataPoints: number[] = [];
  public metric: number;
  public decellularizationStatus: string;
  public decellularizationProgress = 22.2;

  constructor(graphService: GraphService, sessionService: SessionService) {
    this.dataPoints = graphService.processedDataPoints;
    graphService.metricObservable.subscribe((metric) => {
      this.dataPoints = graphService.processedDataPoints;
      this.metric = metric;
    });
    sessionService.decellularizationStatusObservable.subscribe((status) => {
      this.decellularizationStatus = status;
    });
  }

  handleImage = (webcamImage: WebcamImage): void => {
    this.webcamImage = webcamImage;
  };
}
