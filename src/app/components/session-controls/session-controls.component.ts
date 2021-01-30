import { Component, OnInit, Input } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { COMPLETE, INCOMPLETE } from '../../constants/decellularization-statuses';

@Component({
  selector: 'app-session-controls',
  templateUrl: './session-controls.component.html',
  styleUrls: ['./session-controls.component.scss'],
})
export class SessionControlsComponent implements OnInit {
  @Input() selectedStatus: string;
  public decellularizationStatuses: Array<any> = [
    {
      viewValue: 'Complete',
      value: COMPLETE,
    },
    {
      viewValue: 'Incomplete',
      value: INCOMPLETE,
    },
  ];

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService.setDecellularizationStatus(INCOMPLETE);
  }

  public setDecellularizationStatus = (): void =>
    this.sessionService.setDecellularizationStatus(this.selectedStatus);

  public begin = (): void => {
    this.sessionService.startSession();
  };

  public continue = (): void => {
    this.sessionService.continueSession();
  };

  public pause = (): void => {
    this.sessionService.pauseSession();
  };

  public end = (): void => {
    this.sessionService.endSession();
  };

  public reset = (): void => {
    this.sessionService.resetMotorPosition();
  };

  public hardReset = (): void => {
    this.sessionService.hardResetMotorPosition();
  };

  public takeInitialPhoto = (): void => this.sessionService.takeInitialPhoto();

  public shouldEnableInitialPhotoButton = (): boolean =>
    this.sessionService.shouldEnableInitialPhotoButton();

  public shouldDisplayBeginButton = (): boolean => this.sessionService.shouldDisplayBeginButton();

  public shouldDisplayContinueButton = (): boolean =>
    this.sessionService.shouldDisplayContinueButton();

  public shouldEnableContinueButton = (): boolean =>
    this.sessionService.shouldEnableContinueButton();

  public shouldEnablePauseButton = (): boolean => this.sessionService.shouldEnablePauseButton();

  public shouldEnableEndButton = (): boolean => this.sessionService.shouldEnableEndButton();

  public shouldEnableResetButton = (): boolean => this.sessionService.shouldEnableResetButton();
}
