import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PlotlyViaCDNModule } from 'angular-plotly.js';

import { MessagesComponent } from './messages/messages.component';

PlotlyViaCDNModule.plotlyVersion = '1.49.4'; // can be `latest` or any version number (i.e.: '1.40.0')
PlotlyViaCDNModule.plotlyBundle = 'gl3d'; // optional: can be null (for full) or 'basic', 'cartesian', 'geo', 'gl3d', 'gl2d', 'mapbox' or 'finance'

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PlotlyViaCDNModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
