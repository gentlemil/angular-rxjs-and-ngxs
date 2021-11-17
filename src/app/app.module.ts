import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { CountryService } from './shared/country.service';
import { RouterState } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxsModule.forRoot([
      RouterState,
      // AppState,
    ]),
    NgxsReduxDevtoolsPlugin,
    NgxsLoggerPluginModule,
  ],
  providers: [CountryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
