import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session/session.service';

@Component({
  selector: 'app-session-controls',
  templateUrl: './session-controls.component.html',
  styleUrls: ['./session-controls.component.scss']
})
export class SessionControlsComponent implements OnInit {

  constructor(private sessionService: SessionService) { }

  ngOnInit() {
  }

  public begin = (): void => {
    this.sessionService.startSession();
  }

  public continue = (): void => {
    this.sessionService.continueSession();
  }
  
  public pause = (): void => {
    this.sessionService.pauseSession();
  }
  
  public end = (): void => {
    this.sessionService.endSession();
  }
  
  public reset = (): void => {
    this.sessionService.resetMotorPosition();
  }

  public shouldDisplayBeginButton = (): boolean => 
    this.sessionService.shouldDisplayBeginButton()
  
  public shouldDisplayContinueButton = (): boolean => 
    this.sessionService.shouldDisplayContinueButton()
  
  public shouldEnableContinueButton = (): boolean => 
    this.sessionService.shouldEnableContinueButton()

  public shouldEnablePauseButton = (): boolean => 
    this.sessionService.shouldEnablePauseButton()
  
  public shouldEnableEndButton = (): boolean => 
    this.sessionService.shouldEnableEndButton()

  public shouldEnableResetButton = (): boolean => 
    this.sessionService.shouldEnableResetButton()

}
