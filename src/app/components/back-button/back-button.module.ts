import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { BackButtonComponent } from './back-button.component';

@NgModule({
  declarations: [BackButtonComponent],
  imports: [CommonModule, MaterialModule],
  exports: [BackButtonComponent],
})
export class BackButtonModule {}
