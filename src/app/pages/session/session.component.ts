import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { GraphService } from '../../services/graph/graph.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  public webcamImage: WebcamImage = null;
  public dataPoints: number[] = [];
  public metric: number;

  constructor(graphService: GraphService) {
    this.dataPoints = graphService.processedDataPoints;
    graphService.metricObservable.subscribe((metric) => {
      this.dataPoints = graphService.processedDataPoints;
      this.metric = metric;
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  handleImage = (webcamImage: WebcamImage): void => {
    this.webcamImage = webcamImage;
  };
}
