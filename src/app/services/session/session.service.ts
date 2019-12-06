import { Injectable } from '@angular/core';
import { STARTED, NOT_STARTED, PAUSED, ENDED } from '../../constants/session-statuses';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  static instance: SessionService;
  public sessionStatus: string;
  constructor() { 
    if (!SessionService.instance) {
      SessionService.instance = this;
    }
    SessionService.instance.sessionStatus = NOT_STARTED;
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
  }

  public continueSession = (): void => {
    this.sessionStatus = STARTED;
  }

  public pauseSession = (): void => {
    this.sessionStatus = PAUSED;
  }

  public endSession = (): void => {
    this.sessionStatus = ENDED;
  }

  public resetMotorPosition = (): void => {

  }
}
