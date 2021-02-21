import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassifierUiComponent } from './classifier-ui.component';

@NgModule({
  declarations: [ClassifierUiComponent],
  imports: [CommonModule],
  exports: [ClassifierUiComponent],
})
export class ClassifierUiModule {}
