import { Injectable } from '@angular/core';
import { STARTED, NOT_STARTED, PAUSED, ENDED } from '../../constants/session-statuses';
import { SerialportService } from '../serialport/serialport.service';
import { BEGIN, CONTINUE, RESET, PAUSE, END, HOME } from '../../constants/messages';

const WAIT_BETWEEN_PHOTOS = 1000;

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  static instance: SessionService;
  public sessionStatus: string;
  constructor(public serialportService: SerialportService) { 
    if (!SessionService.instance) {
      SessionService.instance = this;
    }
    SessionService.instance.sessionStatus = NOT_STARTED;
    serialportService.init();
    return SessionService.instance;
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
    this.serialportService.sendMessageToBoard(HOME);
  }

  private doStart = (): void => {
    if (this.sessionStatus === STARTED) {
      this.serialportService.sendMessageToBoard(BEGIN);
      setTimeout(() => this.doContinue(), WAIT_BETWEEN_PHOTOS);
    }
  }

  private doContinue = (): void => {
    if (this.sessionStatus === STARTED) {
      this.serialportService.sendMessageToBoard(CONTINUE);
      setTimeout(() => this.doContinue(), WAIT_BETWEEN_PHOTOS);
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
