import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { COMPLETE, INCOMPLETE } from '../../constants/decellularization-statuses'; 



@Component({
  selector: 'app-session-controls',
  templateUrl: './session-controls.component.html',
  styleUrls: ['./session-controls.component.scss']
})
export class SessionControlsComponent implements OnInit {
  public decellularizationStatuses: Array<Object> = [
    {
      viewValue: 'Complete',
      value: COMPLETE
    },
    {
      viewValue: 'Incomplete',
      value: INCOMPLETE
    }
  ];
  
  public selectedStatus: string = INCOMPLETE;

  constructor(private sessionService: SessionService) { }

  ngOnInit() {
    this.sessionService.setDecellularizationStatus(INCOMPLETE);
  }

  public setDecellularizationStatus = () =>
    this.sessionService.setDecellularizationStatus(this.selectedStatus);

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

  public hardReset = (): void => {
    this.sessionService.hardResetMotorPosition();
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
