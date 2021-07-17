import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Device } from '@ionic-native/device/ngx';
import { requestGet, requestPost, errorResult, requestPut, requestDelete } from '../constant';
import { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from '../../_shared/loading.service';
import * as con from '../constant';
import { Storage } from '@ionic/storage';

@Injectable()
export class BaseApiService {

  /**
   * contain api response
   */
  private result: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private apiKey: string;
  private osType: string='windows';
  private osVersion: string;
  private deviceId: string;
  private body: HttpParams;

  constructor(
    public http: HttpClient,
    public platform: Platform,
    private device: Device,
    public storage: Storage,
    public router: Router,
    public loading: LoadingService,
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.apiKey = '3c99adad3c7d2847b81ea7d5a14604987dabb9b4';
        this.osType = 'ios';
      } else if (this.platform.is('android')) {
        this.apiKey = '96e7f192383ef29f4ba042220aef873a098ba7ff';
        this.osType = 'android';
      } else {
        this.apiKey = '96e7f192383ef29f4ba042220aef873a098ba7ff';
        this.osType = 'android';
      }
      console.log('OS type here', this.device);
      if (this.device.version !== undefined && this.device.uuid !== undefined) {
        this.osVersion = this.device.version;
        this.deviceId = this.device.uuid;
      }
    });

   }

  /**
   * manage all api calling
   * @param url api endpoint
   * @param rtype constant of unique request. you can identify a response by this
   * @param bodydata optional, post data
   * @param requesttype constat of GET, POST
   */
  public genericApiCall(url, rtype: string, bodydata: any = null, requesttype: string = requestGet, json: boolean = true) {
    // const headers = {
    //   headers: new HttpHeaders({
    //     'Accept': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     'Content-Type': 'application/json'
    //   })
    // };
    let headers: any;
    if (rtype === 'dispatchItem') {
      headers = this.getHeaderText(json);
      bodydata = this.prepareRequestBodyText(bodydata);
    } else {
      headers = this.getHeader(json);
      bodydata = this.prepareRequestBody(bodydata);
    }


    switch (requesttype) {
      case requestGet:
        this.http.get(url, {headers}).subscribe(
          data => {
            this.result.next({ resultType: rtype, result: data });
          },
          error => {
            this.handleError(error, rtype);
          }
        );
        break;

      case requestPost:
        bodydata = bodydata ? bodydata : {};
        this.http.post(url, bodydata, {headers}).subscribe(
          data => {
            if (rtype === con.logout) {
              this.finalLogout(data);
            } else {
              this.result.next({ resultType: rtype, result: data });
            }
          },
          error => {
            this.handleError(error, rtype);
          }
        );
        break;
      case requestPut:
        bodydata = bodydata ? bodydata : {};
        this.http.put(url, bodydata, {headers}).subscribe(
          data => {
            this.result.next({ resultType: rtype, result: data });
          },
          error => {
            this.handleError(error, rtype);
          }
        );
        break;
      case requestDelete:
        bodydata = bodydata ? bodydata : {};
        this.http.delete(url, {headers}).subscribe(
          data => {
            this.result.next({ resultType: rtype, result: data });
          },
          error => {
            this.handleError(error, rtype);
          }
        );
        break;
    }
  }

  /**
   * handle http error response
   * @param error error
   * @param requestid requestid
   */
  private handleError(error: any, requestid: string) {
    this.result.next({
      resultType: requestid,
      result: {status: 'failed', bstatus: 1, errorCode: 400, message: 'Bad Internet Connection'}
    });
  }

  private setTodayDate(data: any) {
    this.storage.set('todayDate', data.date);
    console.log('date', data.date);
    return true;
  }

  /**
   * observer of api response
   */
  get apiResults() {
    return this.result.asObservable();
  }

  /**
   * this will add header on each http request
   */
  getHeader(json: boolean = true) {

    const headers = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded');
    // {
    //   // Accept: 'application/x-www-form-urlencoded',
    //   // 'Access-Control-Allow-Origin': '*'
    // };

    // if (json) {
    //   headers['Content-Type'] = 'application/json';
    // }

    return headers;
  }

  /**
   * this will add header on each http request
   */
  getHeaderText(json: boolean = true) {

    const headers = new HttpHeaders()
    .set('Content-Type', 'text/plain');
    // {
    //   // Accept: 'application/x-www-form-urlencoded',
    //   // 'Access-Control-Allow-Origin': '*'
    // };

    // if (json) {
    //   headers['Content-Type'] = 'application/json';
    // }

    return headers;
  }

  /**
   * This will add all other common parammeter to request body
   */
  prepareRequestBody(bodydata: any) {
    //bodydata.os_type = '';
  //  bodydata.os_version = this.osVersion;
   // bodydata.orgId = con.ORG_ID;
  ////  bodydata.contactHierId = con.CONTACT_HIER_ID;
 //   bodydata.programId = con.PROGRAM_ID;
  //  bodydata.app_ver = con.APP_VERSION;
  //  bodydata.APIkey = this.apiKey;
  //  bodydata.deviceId = this.deviceId;
    this.body = new HttpParams();
    for (const key in bodydata) {
      if (bodydata.hasOwnProperty(key)) {
        this.body = this.body.set(key, bodydata[key]);
      }
    }
    return this.body.toString();
  }

  prepareRequestBodyText(bodydata: any) {
   // bodydata.os_type = this.osType;
 //   bodydata.os_version = this.osVersion;
  //  bodydata.orgId = con.ORG_ID;
  //  bodydata.contactHierId = con.CONTACT_HIER_ID;
  //  bodydata.programId = con.PROGRAM_ID;
    bodydata.app_ver = con.APP_VERSION;
    bodydata.APIkey = this.apiKey;
    bodydata.deviceId = this.deviceId;
    this.body = new HttpParams();
    for (const key in bodydata) {
      if (bodydata.hasOwnProperty(key)) {
        this.body = this.body.set(key, bodydata[key]);
      }
    }
    return JSON.stringify(bodydata);
  }

  public finalLogout(data: any) {
    this.storage.clear();
    this.loading.dismiss();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        pgRefresh : 1
      }
    };
    this.router.navigate(['/login'], navigationExtras);
  }

  public clearAndFinalLogout() {
    this.storage.clear();
    this.router.navigate(['/login']);
  }
}
