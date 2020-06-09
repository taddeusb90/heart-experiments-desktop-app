import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class SpectrometerService {
  private sharp: any
  constructor(
    public electronService: ElectronService,
  ) { 
    this.sharp = electronService.sharp;
  }

  measureImage(filePath: string): Promise<number> {
   return new Promise((resolve, reject) => {
      this.sharp(filePath).stats((err, stats) => { 
        if (err) reject(err);
        const channelsMean = stats.channels.reduce((acc, channel)=>{ acc += channel.mean; return acc;},0)/3;
        resolve(channelsMean);
      });
    });
  }
  


}
