import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { SessionHistoryRoutingModule } from './session-history-routing.module';
import { SessionHistoryComponent } from './session-history.component';

@NgModule({
  declarations: [SessionHistoryComponent],
  imports: [CommonModule, SessionHistoryRoutingModule, MaterialModule],
})
export class SessionHistoryModule {}
