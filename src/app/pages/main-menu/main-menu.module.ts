import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { MainMenuRoutingModule } from './main-menu-routing.module';
import { MainMenuComponent } from './main-menu.component';

@NgModule({
  declarations: [MainMenuComponent],
  imports: [CommonModule, MainMenuRoutingModule, MaterialModule],
})
export class MainMenuModule {}
