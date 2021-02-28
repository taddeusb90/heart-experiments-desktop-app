import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { SessionModule } from './pages/session/session.module';
import { MainMenuModule } from './pages/main-menu/main-menu.module';
import { ViewSessionModule } from './pages/view-session/view-session.module';
import { SessionHistoryModule } from './pages/session-history/session-history.module';
import { ReprocessSessionsModule } from './pages/reprocess-sessions/reprocess-sessions.module';
import { AppComponent } from './app.component';
import { WebviewDirective } from './directives/webview/webview.directive';
import { MaterialModule } from './material.module';
import { LineChartModule } from './components/line-chart/line-chart.module';
import { ClassifierUiModule } from './components/classifier-ui/classifier-ui.module';
import { CompareSessionsModule } from './pages/compare-sessions/compare-sessions.module';
import { BackButtonModule } from './components/back-button/back-button.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, WebviewDirective],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SessionModule,
    MainMenuModule,
    CompareSessionsModule,
    ViewSessionModule,
    SessionHistoryModule,
    ReprocessSessionsModule,
    AppRoutingModule,
    MaterialModule,
    LineChartModule,
    BackButtonModule,
    ClassifierUiModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [MaterialModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
