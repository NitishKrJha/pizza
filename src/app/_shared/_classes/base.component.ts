import { BaseService } from '../_services/base.service';
import { errorResult } from '../constant';
import { Injectable, OnDestroy, Optional, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform, Events } from '@ionic/angular';
import { Router, Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { AppUpdatePage } from '../../pages/app-update/app-update.page';
import { RouterStorageService } from '../_services/router-storage.service';
import * as con from '../constant';

@Injectable()
export class BaseComponent implements OnDestroy {

  private apiSubscription: Subscription;

  /**
   * manage dependency injcection of services
   *
   * @param baseService base service
   */

  public base;
  public router;
  public actRoute;
  public mNetwork;
  public isUpdateNotofication = 0;
  public routStorage;
  public platform;
  // private connectSubscription;
  public storage;
  public events;
  public userData: any = [];
  constructor(
    injector: Injector
  ) {
    this.base = injector.get(BaseService);
    this.router = injector.get(Router);
    this.actRoute = injector.get(ActivatedRoute);
    this.mNetwork = injector.get(Network);
    this.storage = injector.get(Storage);
    this.routStorage = injector.get(RouterStorageService);
    this.platform = injector.get(Platform);
    this.events = injector.get(Events);
  }

  initBaseComponent() {
    console.log('init basecomponent');
    this.platform.backButton.subscribe(() => {
      console.log('this.constructor.name', this.constructor.name);
      if (this.constructor.name === 'HomePage') {
        //this.platform.exitApp();
      }
    });
    this.apiSubscription = this.base.api.result.subscribe( (data) =>  {
      if (data.length !== 0) {
        console.log('data',data.result.status.err_code);
        if (data.resultType === errorResult) {
          // If any issue produce due to network or unavailibility of host
          // const errorMessage = data.result.message ? data.result.message : 'something went wrong';
          const errorMessage = 'Something went wrong please contact with support team';
          this.base.shared.Alert.show_alert('Error!', errorMessage);
          return true;
        } else if ( data.result === undefined || data.result === null ) {
          // const errorMessage = data.result && data.result.message ? data.result.message : 'something went wrong';
          const errorMessage = 'Something went wrong please contact with support team';
          this.base.shared.Alert.show_alert('Error!', errorMessage);
          return true;
        } else {
          if (data.result.app_version_details !== undefined && Object.keys(data.result.app_version_details).length > 0) {
            if (this.handleAppUpdate(data)) {
              return false;
            }
          }
          if ((data.result !== undefined && data.result.status.err_code == '500' || data.result.status.err_code == '404')) {
            // If any internal issue or error occour at API which return blank or non JSON value
            console.log('Msg Code', data.result);
            // if ( data.result.msg_code === 'msg_1008') {
            //   this.storage.clear();0
            //   this.router.navigate(['/login']);
            // }
            this.handleApiResponseError(data);
          } else {
            // if ( data.result.msg_code === 'msg_1008') {
            //   this.storage.clear();
            //   this.router.navigate(['/login']);
            // }
            this.handleApiResponse(data);
          }
        }
      }
    });

    
  }

  /**
   * this will handel all api response, must be override on child component
   *
   * @param data any
   */
  handleApiResponse(data: any) {
    console.log('Change Password Response333333333333333', data);
  }

  /**
   * this will handel all api response error, must be override on child component
   *
   * @param data any
   */
  handleApiResponseError(data: any) { }

  /**
   * this will handel all app update notification
   *
   * @param data any
   */
  handleAppUpdate(data: any) {
    this.routStorage.storage = {
      app_version_details: data.result.app_version_details
    };
    if (data.result.app_version_details.is_force_update === '0') {
      if (this.isUpdateNotofication === 0) {
        this.routStorage.storage.is_modal = 1;
        this.base.shared.Modal.showModal(AppUpdatePage);
        // this.base.shared.Alert.show_alert('Warning!', data.result.app_version_details.update_message);
        // this.isUpdateNotofication = 1;
        return false;
      }
    } else if (data.result.app_version_details.is_force_update === '1') {
      this.router.navigate(['/app-update']);
      return true;
    }
  }

  handleValidationError(data: any) { }

  /**
   * unsubscribe api response subscriber on component destroy
   */
  ngOnDestroy() {
    if (this.apiSubscription !== undefined) {
      this.apiSubscription.unsubscribe();
    }
  }
}
