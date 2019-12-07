import { Injectable } from '@angular/core';
import { SerialportService } from '../serialport/serialport.service';
import { STARTED, NOT_STARTED, PAUSED, ENDED } from '../../constants/session-statuses';
import { BEGIN, CONTINUE, RESET, PAUSE, END, HOME } from '../../constants/messages';
import { COMPLETE, INCOMPLETE } from '../../constants/decellularization-statuses';
import { ElectronService } from '../electron/electron.service';
import { CameraService } from '../camera/camera.service';
import { WebcamImage } from 'ngx-webcam';

const WAIT_BETWEEN_PHOTOS = 1000;

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  static instance: SessionService;
  public sessionStatus: string;
  public decellularizationStatus: string;
  public sessionTimestamp: number;
  constructor(
    public serialportService: SerialportService, 
    public electronService: ElectronService, 
    public cameraService: CameraService
    ) { 
    if (!SessionService.instance) {
      SessionService.instance = this;
    }
    SessionService.instance.sessionStatus = NOT_STARTED;
    SessionService.instance.decellularizationStatus = INCOMPLETE;
    serialportService.init();
    cameraService.pictureObservable.subscribe(this.processPicture)
    setTimeout(() => serialportService.confirmationObservable.subscribe(this.processConfirmation), 2000);
    
    return SessionService.instance;
  }

  private processConfirmation = (data: string ) => {
    console.log(`confirmation> ${data}`)
    switch (data) {
      case BEGIN:
        setTimeout(() => {
          this.cameraService.triggerSnapshot();
          this.doContinue()
        }, WAIT_BETWEEN_PHOTOS);
        break;
      case CONTINUE:
        setTimeout(() => { 
          this.cameraService.triggerSnapshot();
          this.doContinue()
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
  }

  private processPicture = ( picture: WebcamImage) => {
    const { base64Img } = this.electronService;
    const pictureTimestamp = Math.round((new Date()).getTime() / 1000);
    if (this.decellularizationStatus === INCOMPLETE) {
      console.log(INCOMPLETE, picture);
      
      base64Img.img(picture.imageAsDataUrl, `dest/${this.sessionTimestamp}/incomplete`, pictureTimestamp, function(err, filepath) {
        console.log(err, filepath);
      });
    } else if (this.decellularizationStatus === COMPLETE) {
      console.log(COMPLETE, picture);
      base64Img.img(picture.imageAsDataUrl, `dest/${this.sessionTimestamp}/complete`, pictureTimestamp, function(err, filepath) {
        console.log(err, filepath);
      });
    } else {
      console.error('Problems saving picture', picture);
    }
  }

  public setDecellularizationStatus = (status: string): void => {
    this.decellularizationStatus = status;
  }
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

  public startSession = () : void => {
    this.sessionStatus = STARTED;
    this.doStart();
  }

  public continueSession = (): void => {
    this.sessionStatus = STARTED;
    this.doContinue();
  }

  public pauseSession = (): void => {
    this.sessionStatus = PAUSED;
    this.doPause();
  }

  public endSession = (): void => {
    this.sessionStatus = ENDED;
    this.doEnd();
  }

  public resetMotorPosition = (): void => {
    this.sessionStatus = PAUSED;
    this.serialportService.sendMessageToBoard(RESET);
  }

  public hardResetMotorPosition = (): void => {
    this.sessionStatus = PAUSED;
    this.sessionTimestamp = Math.round((new Date()).getTime() / 1000);
    this.serialportService.sendMessageToBoard(HOME);
  }

  private doStart = (): void => {
    if (this.sessionStatus === STARTED) {
      this.sessionTimestamp = Math.round((new Date()).getTime() / 1000);
      this.serialportService.sendMessageToBoard(BEGIN);
    }
  }

  private doContinue = (): void => {
    if (this.sessionStatus === STARTED) {
      this.serialportService.sendMessageToBoard(CONTINUE);
    } 
  }

  private doPause = (): void => {  
    if (this.sessionStatus === PAUSED) {
      this.serialportService.sendMessageToBoard(PAUSE);
    }
  }

  private doEnd = (): void => {  
    if (this.sessionStatus === ENDED) { 
      this.serialportService.sendMessageToBoard(END);
    }
  }

}
