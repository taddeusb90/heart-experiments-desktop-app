import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root',
})
export class SpectrometerService {
  static instance: SpectrometerService;
  private sharp: any;
  public spectroMetric: Subject<number> = new Subject<number>();
  constructor(public electronService: ElectronService) {
    if (!SpectrometerService.instance) {
      SpectrometerService.instance = this;
    }
    this.sharp = electronService.sharp;
    return SpectrometerService.instance;
  }

  measureImage(filePath: string): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const buffer = await this.sharp(filePath)
        .extract({ left: 170, top: 40, width: 650, height: 617 })
        .toBuffer();

      this.sharp(buffer).stats((err, stats) => {
        console.log(stats);
        if (err) reject(err);
        const channelsMean =
          stats.channels.reduce((acc, channel) => {
            acc += channel.mean;
            return acc;
          }, 0) / 3;
        this.handleMetric(channelsMean);
        resolve(channelsMean);
      });
    });
  }

  public get spectroMetricObservable(): Observable<number> {
    return this.spectroMetric.asObservable();
  }

  public handleMetric(metric: number): void {
    this.spectroMetric.next(metric);
  }
}
