import { Injectable } from '@angular/core';
import { ElectronService } from "../electron/electron.service";
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpectrometerService {
  private sharp: any
  public metric: Subject<Number>  = new Subject<Number>();
  constructor(
    public electronService: ElectronService,
  ) { 
    this.sharp = electronService.sharp;
  }

  measureImage(filePath: string) {
    this.sharp(filePath).stats((err, stats) => { 
      if (err) return console.log(err, stats)
      const channelsMean = stats.channels.reduce((acc, channel)=>{ acc += channel.mean; return acc;},0)/3;
      this.metric.next(channelsMean);
    });
  }
  
  public get metricObservable(): Observable<Number> {
    return this.metric.asObservable();
  }


}
