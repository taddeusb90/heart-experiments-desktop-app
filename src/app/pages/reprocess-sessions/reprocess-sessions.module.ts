import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { ClassifierUiModule } from '../../components/classifier-ui/classifier-ui.module';
import { ReprocessSessionsRoutingModule } from './reprocess-sessions-routing.module';
import { ReprocessSessionsComponent } from './reprocess-sessions.component';

@NgModule({
  declarations: [ReprocessSessionsComponent],
  imports: [CommonModule, ReprocessSessionsRoutingModule, MaterialModule, ClassifierUiModule],
})
export class ReprocessSessionsModule {}
