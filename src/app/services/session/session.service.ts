import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { WebcamImage } from 'ngx-webcam';
import { SerialportService } from '../serialport/serialport.service';
import {
  STARTED,
  NOT_STARTED,
  PAUSED,
  ENDED,
} from '../../constants/session-statuses';
import {
  BEGIN,
  CONTINUE,
  RESET,
  PAUSE,
  END,
  HOME,
} from '../../constants/messages';
import { WORK_FOLDER } from '../../constants/file-system';
import {
  COMPLETE,
  INCOMPLETE,
} from '../../constants/decellularization-statuses';
import { ElectronService } from '../electron/electron.service';
import { CameraService } from '../camera/camera.service';
import { SpectrometerService } from '../spectrometer/spectrometer.service';
import { DataStoreService } from '../data-store/data-store.service';

const WAIT_BETWEEN_PHOTOS = 1000;

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  static instance: SessionService;
  public sessionStatus: string;
  public decellularizationStatus: string;
  public sessionTimestamp: number;
  public sessionID: number;
  constructor(
    public serialportService: SerialportService,
    public electronService: ElectronService,
    public cameraService: CameraService,
    public spectrometerService: SpectrometerService,
    public dataStoreService: DataStoreService
  ) {
    if (!SessionService.instance) {
      SessionService.instance = this;
    }
    SessionService.instance.sessionStatus = NOT_STARTED;
    SessionService.instance.decellularizationStatus = INCOMPLETE;
    // serialportService.init();

    cameraService.pictureObservable.subscribe(async (picture) => {
      if (!this.sessionTimestamp) return;
      const filePath = await this.processPicture(picture),
       metric = await this.spectrometerService.measureImage(filePath),
       sessionInfo = {
        sessionId: this.sessionID,
        createdAt: new Date(),
        imageLocation: filePath,
        spectroMetric: metric,
        type: this.decellularizationStatus,
      };
      this.dataStoreService.insertSessionInfo(sessionInfo);
    });
       
        

    setTimeout(() => {
      cameraService.triggerSnapshot();
      this.doContinue();
    }, 2000);
    // setTimeout(
    //   () =>
    //     serialportService.confirmationObservable.subscribe(
    //       this.processConfirmation
    //     ),
    //   2000
    // );

    return SessionService.instance;
  }


  private processConfirmation = (data: string) => {
    console.log(`confirmation> ${data}`);
    switch (data) {
      case BEGIN:
        setTimeout(() => {
          this.cameraService.triggerSnapshot();
          this.doContinue();
        }, WAIT_BETWEEN_PHOTOS);
        break;
      case CONTINUE:
        setTimeout(() => {
          this.cameraService.triggerSnapshot();
          this.doContinue();
        }, WAIT_BETWEEN_PHOTOS);
        break;
      case RESET:
        break;
      case PAUSE:
        break;
      case END:
        break;
      case HOME:
        break;
      default:
        break;
    }
  };

  private processPicture = (picture: WebcamImage): Promise<string> => {
    const { base64Img } = this.electronService,
     pictureTimestamp = Math.round(new Date().getTime() / 1000),
     saveDir = `${WORK_FOLDER}/sessions/${
      this.sessionTimestamp
    }/${this.decellularizationStatus.toLocaleLowerCase()}`;
    
    return new Promise((resolve, reject) => {
      base64Img.img(
        picture.imageAsDataUrl,
        saveDir,
        pictureTimestamp,
        (err, filePath) => {
          if (err) {
            reject(err);
          }
  
          resolve(filePath);
        }
      );
    });
  };

  public setDecellularizationStatus = (status: string): void => {
    this.decellularizationStatus = status;
  };
  public shouldDisplayBeginButton = (): boolean =>
    [NOT_STARTED, ENDED].includes(this.sessionStatus);

  public shouldDisplayContinueButton = (): boolean =>
    [STARTED, PAUSED].includes(this.sessionStatus);

  public shouldEnableContinueButton = (): boolean =>
    [PAUSED].includes(this.sessionStatus);

  public shouldEnablePauseButton = (): boolean =>
    [STARTED].includes(this.sessionStatus);

  public shouldEnableEndButton = (): boolean =>
    [STARTED, PAUSED].includes(this.sessionStatus);

  public shouldEnableResetButton = (): boolean =>
    [STARTED, PAUSED].includes(this.sessionStatus);

  public startSession = (): void => {
    this.sessionStatus = STARTED;
    this.doStart();
  };

  public continueSession = (): void => {
    this.sessionStatus = STARTED;
    this.doContinue();
  };

  public pauseSession = (): void => {
    this.sessionStatus = PAUSED;
    this.doPause();
  };

  public endSession = (): void => {
    this.sessionStatus = ENDED;
    this.doEnd();
  };

  public resetMotorPosition = (): void => {
    this.sessionStatus = PAUSED;
    this.serialportService.sendMessageToBoard(RESET);
  };

  public hardResetMotorPosition = (): void => {
    this.sessionStatus = PAUSED;
    this.sessionTimestamp = Math.round(new Date().getTime() / 1000);
    this.serialportService.sendMessageToBoard(HOME);
  };

  private doStart = async (): Promise<void> => {
    if (this.sessionStatus === STARTED) {
      const date = new Date(),
       timestamp = Math.round(date.getTime() / 1000);
      this.sessionTimestamp = timestamp;
      this.sessionID = await this.dataStoreService.insertSession({ session: timestamp,  createdAt: date});
      setTimeout(() => {
        this.cameraService.triggerSnapshot();
        this.doContinue();
      }, WAIT_BETWEEN_PHOTOS);
      // this.serialportService.sendMessageToBoard(BEGIN);
    }
  };

  private doContinue = (): void => {
    if (this.sessionStatus === STARTED) {
      setTimeout(() => {
        this.cameraService.triggerSnapshot();
        this.doContinue();
      }, WAIT_BETWEEN_PHOTOS);
      // this.serialportService.sendMessageToBoard(CONTINUE);
    }
  };

  private doPause = (): void => {
    if (this.sessionStatus === PAUSED) {
      // this.serialportService.sendMessageToBoard(PAUSE);
    }
  };

  private doEnd = (): void => {
    if (this.sessionStatus === ENDED) {
      // this.serialportService.sendMessageToBoard(END);
    }
  };
}
