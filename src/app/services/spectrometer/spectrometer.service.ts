import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root',
})
export class SpectrometerService {
  private sharp: any;
  constructor(public electronService: ElectronService) {
    this.sharp = electronService.sharp;
  }

  measureImage(filePath: string): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const buffer = await this.sharp(filePath)
        .extract({ left: 180, top: 10, width: 851, height: 617 })
        .toBuffer();

      this.sharp(buffer).stats((err, stats) => {
        if (err) reject(err);
        const channelsMean =
          stats.channels.reduce((acc, channel) => {
            acc += channel.mean;
            return acc;
          }, 0) / 3;
        resolve(channelsMean);
      });
    });
  }
}
