import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Network } from '@ionic-native/network/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppUpdatePage } from './pages/app-update/app-update.page';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Device } from '@ionic-native/device/ngx';
import { Market } from '@ionic-native/market/ngx';

import { Camera } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';

// Shared Module
import { BaseService } from './_shared/_services/base.service';
import { ApiService } from './_shared/_services/api.service';
import { DatasharingService } from './_shared/_services/datasharing.service';
import { Shared } from './_shared/_classes/share.class';
import { SharedModule } from './_shared/shared.module';

import { RouterStorageService } from './_shared/_services/router-storage.service';


@NgModule({
  declarations: [AppComponent, AppUpdatePage],
  entryComponents: [AppUpdatePage],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__epod',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    SharedModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    WebView,
    FilePath,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ApiService,
    BaseService,
    DatasharingService,
    Shared,
    Device,
    Network,
    RouterStorageService,
    Market
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
