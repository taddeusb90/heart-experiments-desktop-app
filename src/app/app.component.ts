import { Component, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ElectronService } from './services/electron/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') componentCssClass;

  constructor(
    public electronService: ElectronService,
    public overlayContainer: OverlayContainer,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);
    this.overlayContainer.getContainerElement().classList.add('default-theme');
    this.componentCssClass = 'default-theme';

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('All electron service', electronService);
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  minimizeApp() {
    this.electronService.ipcRenderer.send('app-minimize', true);
  }

  maximizeApp() {
    this.electronService.ipcRenderer.send('app-maximize', true);
  }

  closeApp() {
    this.electronService.ipcRenderer.send('app-close', true);
  }

}
