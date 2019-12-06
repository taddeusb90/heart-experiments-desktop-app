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
    console.log('clicked');
    this.sessionService.startSession();
  }

  public continue = (): void => {
    console.log('clicked');
    this.sessionService.continueSession();
  }
  
  public pause = (): void => {
    console.log('clicked');
    this.sessionService.pauseSession();
  }
  
  public end = (): void => {
    console.log('clicked');
    this.sessionService.endSession();
  }
  
  public reset = (): void => {
    console.log('clicked');
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
