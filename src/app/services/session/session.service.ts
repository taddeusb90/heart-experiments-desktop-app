import { Injectable } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { SerialportService } from '../serialport/serialport.service';
import { GraphService } from '../graph/graph.service';
import { STARTED, NOT_STARTED, PAUSED, ENDED } from '../../constants/session-statuses';
import { BEGIN, CONTINUE, RESET, PAUSE, END, HOME } from '../../constants/messages';
import { WORK_FOLDER } from '../../constants/file-system';
import { ElectronService } from '../electron/electron.service';
import { CameraService } from '../camera/camera.service';
import { SpectrometerService } from '../spectrometer/spectrometer.service';
import { DataStoreService } from '../data-store/data-store.service';
import { ClassifierService } from '../classifier/classifier.service';

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
  public decellularizationStatusSubject: Subject<string> = new Subject<string>();
  public decellularizationPercentageSubject: Subject<number> = new Subject<number>();
  public predictions: number[] = [];
  public decellularizationPercentage: number;

  constructor(
    public serialportService: SerialportService,
    public electronService: ElectronService,
    public cameraService: CameraService,
    public spectrometerService: SpectrometerService,
    public dataStoreService: DataStoreService,
    public graphService: GraphService,
    public classifierService: ClassifierService,
  ) {
    if (!SessionService.instance) {
      SessionService.instance = this;
    }
    SessionService.instance.sessionStatus = NOT_STARTED;
    SessionService.instance.decellularizationStatus = graphService.decellularizationStatus;
    serialportService.init();
    classifierService.loadModel();
    cameraService.pictureObservable.subscribe(async (picture) => {
      if (!this.sessionTimestamp) return;
      const filePath = await this.processPicture(picture);
      if (![NOT_STARTED, ENDED].includes(this.sessionStatus)) {
        const metric = await this.spectrometerService.measureImage(filePath),
          prediction = await this.classifierService.makePrediction(filePath),
          sessionInfo = {
            sessionId: this.sessionID,
            createdAt: new Date(),
            imageLocation: filePath,
            spectroMetric: metric,
            type: this.decellularizationStatus,
            prediction,
          };
        this.graphService.setCurrentDataPoint(metric);
        this.dataStoreService.insertSessionInfo(sessionInfo);
      }
    });

    classifierService.predictionObservable.subscribe((prediction) => {
      this.predictions.push(prediction);
      if (this.predictions.length > 400) {
        this.predictions.shift();
      }
      this.decellularizationPercentage = Math.round(
        (this.predictions.reduce((acc, cv) => {
          return acc + cv;
        }, 0) /
          this.predictions.length) *
          10,
      );
      if (this.predictions.length === 400) {
        this.handleDecellularizationPercentage(this.decellularizationPercentage);
      }
    });

    // setTimeout(() => {
    //   cameraService.triggerSnapshot();
    //   this.doContinue();
    // }, 2000);

    setTimeout(
      () => serialportService.confirmationObservable.subscribe(this.processConfirmation),
      2000,
    );

    return SessionService.instance;
  }

  private processConfirmation = (data: string): void => {
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
          this.setDecellularizationStatus(this.graphService.decellularizationStatus);
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
      }/${this.decellularizationStatus.toLocaleLowerCase()}`,
      initDir = `${WORK_FOLDER}/sessions`,
      isInitPhoto = [NOT_STARTED, ENDED].includes(this.sessionStatus);
    return new Promise((resolve, reject) => {
      base64Img.img(
        picture.imageAsDataUrl,
        isInitPhoto ? initDir : saveDir,
        isInitPhoto ? `${this.sessionTimestamp}-init` : pictureTimestamp,
        (err, filePath) => {
          if (err) {
            reject(err);
          }
          if (isInitPhoto) {
            this.spectrometerService.setInitialImage(filePath);
          }
          resolve(filePath);
        },
      );
    });
  };

  public get decellularizationPercentageObservable(): Observable<number> {
    return this.decellularizationPercentageSubject.asObservable();
  }

  public handleDecellularizationPercentage(percentage: number): void {
    return this.decellularizationPercentageSubject.next(percentage);
  }
  public get decellularizationStatusObservable(): Observable<string> {
    return this.decellularizationStatusSubject.asObservable();
  }

  public setDecellularizationStatus = (status: string): void => {
    this.decellularizationStatus = status;
    this.decellularizationStatusSubject.next(status);
  };

  public takeInitialPhoto = (): void => {
    const date = new Date(),
      timestamp = Math.round(date.getTime() / 1000);
    this.sessionTimestamp = timestamp;
    this.cameraService.triggerSnapshot();
  };

  public shouldEnableInitialPhotoButton = (): boolean =>
    ![NOT_STARTED, ENDED].includes(this.sessionStatus);

  public shouldDisplayBeginButton = (): boolean =>
    [NOT_STARTED, ENDED].includes(this.sessionStatus);

  public shouldDisplayContinueButton = (): boolean =>
    [STARTED, PAUSED].includes(this.sessionStatus);

  public shouldEnableContinueButton = (): boolean => [PAUSED].includes(this.sessionStatus);

  public shouldEnablePauseButton = (): boolean => [STARTED].includes(this.sessionStatus);

  public shouldEnableEndButton = (): boolean => [STARTED, PAUSED].includes(this.sessionStatus);

  public shouldEnableResetButton = (): boolean => [STARTED, PAUSED].includes(this.sessionStatus);

  public startSession = (): void => {
    this.graphService.resetGraph();
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
    this.graphService.resetGraph();
    this.sessionStatus = PAUSED;
    this.serialportService.sendMessageToBoard(RESET);
  };

  public hardResetMotorPosition = (): void => {
    this.graphService.resetGraph();
    this.sessionStatus = PAUSED;
    this.sessionTimestamp = Math.round(new Date().getTime() / 1000);
    this.serialportService.sendMessageToBoard(HOME);
  };

  private doStart = async (): Promise<void> => {
    if (this.sessionStatus === STARTED) {
      this.sessionID = await this.dataStoreService.insertSession({
        session: this.sessionTimestamp,
        createdAt: new Date(this.sessionTimestamp * 1000),
      });
      setTimeout(() => {
        this.cameraService.triggerSnapshot();
        this.doContinue();
      }, WAIT_BETWEEN_PHOTOS);
      this.serialportService.sendMessageToBoard(BEGIN);
    }
  };

  private doContinue = (): void => {
    if (this.sessionStatus === STARTED) {
      // setTimeout(() => {
      //   this.cameraService.triggerSnapshot();
      //   this.doContinue();
      // }, WAIT_BETWEEN_PHOTOS);
      this.serialportService.sendMessageToBoard(CONTINUE);
    }
  };

  private doPause = (): void => {
    if (this.sessionStatus === PAUSED) {
      this.serialportService.sendMessageToBoard(PAUSE);
    }
  };

  private doEnd = (): void => {
    if (this.sessionStatus === ENDED) {
      this.serialportService.sendMessageToBoard(END);
    }
  };
}
