import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import * as con from '../constant';
import { DatasharingService } from '../../_shared/_services/datasharing.service';

@Injectable()
export class Shared {
  private body: HttpParams;
  public localItemListData: any;
  public offlineProcessingKey: [];
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public storage: Storage,
    public http: HttpClient,
    public modalController: ModalController,
    public dataService: DatasharingService,
  ) {}

  public Alert = {
    show_alert: async (title: string = 'Alert', alertMessage: string = '') => {
      const alert = await this.alertCtrl.create({
        header: title,
        message: alertMessage,
        buttons: ['OK']
      });
      return await alert.present();
    },
    present_confirm: async (title: string = 'Alert', alertMessage: string = '', trueCallback =  Function , falseCallback = Function) => {
      const alert = await this.alertCtrl.create({
        header: title,
        message: alertMessage,
        buttons: [
          {
            text: 'NO',
            role: 'cancel',
            handler: () => {
              trueCallback();
            }
          },
          {
            text: 'YES',
            handler: () => {
              falseCallback();
            }
          }
        ]
      });
      return await alert.present();
    }
  };

  public Modal = {
    showModal: async (modalComponent, modalData) => {
      const modal = await this.modalController.create({
        component: modalComponent,
        componentProps: modalData
      });
      return await modal.present();
    }
  };

  public Toast = {
    showToast: async (toastMessage: string, toastDuration: number, toastAnimated: boolean = true) => {
      const toast = await this.toastController.create({
        message: toastMessage,
        duration: toastDuration,
        animated: toastAnimated
      });
      return await toast.present();
    }
  };

  public Lstorage = {
    fetchData: async (key: string) => {
      if (key === 'itemList') {
        //console.log('1Local Item1 : ', this.storage.get(key));
      }
      return await this.storage.get(key);
    },
    setData: async (key: string, val: string) => {
      return await this.storage.set(key, val);
    },
    delData: async (key: string) => {
      return await this.storage.remove(key);
    }
  };


  public bgFn = {
    syncData: async () => {
      const offKeyData = this.dataService.getofflineProKey();
      if (offKeyData !== undefined) {
        this.offlineProcessingKey = offKeyData;
      } else {
        this.offlineProcessingKey = [];
      }
      
      console.log('this.dataService.getofflineProKey()', this.dataService.getofflineProKey());
      this.Lstorage.fetchData('todaySyncItem').then(item => {
        console.log('item', item);
        if (item !== null && item !== undefined) {
          const localItemList = JSON.parse(item);
          this.localItemListData = localItemList;
          console.log('localItemList', localItemList);
          const DISPATCH_URL = con.API_URL + 'v1/epod_req/dispatch';
          let headers: any;
          let bodydata: any;
          headers = this.getHeaderText(true);
          for (let key in localItemList) {
            if (localItemList[key] !== undefined){
              console.log('Items Child ' + key, localItemList[key]);
              const items = localItemList[key];
              if (items.item_status === 'Dispatched' && items.postData && items.process === 0) {
                bodydata = this.prepareRequestBodyText(items.postData);
                console.log('this.offlineProcessingKey', this.offlineProcessingKey);
                this.offlineProcessingKey[key] = 1;
                this.dataService.setofflineProKey(this.offlineProcessingKey);
                const res1 = this.http.post(DISPATCH_URL, bodydata, {headers}).subscribe((response) => {
                    console.log('response',response);
                    this.responseCheck(response,key);
                });
              } else {
                console.log('Data not found', key);
              }
            }
          }
        }
      });
    }
  };

  

  public loading;
  public isLoading = false;
  public loaderToShow: any;


  public Loader = {
    present_loader: async () => {
      this.loading = await this.loadingCtrl.create({
        spinner: 'crescent',
        message: 'Loading Please Wait...',
        showBackdrop: false
      });
      return await this.loading.present()
      .then(() => {
        console.log('presented');
        if (!this.isLoading) {
         this.loading.dismiss().then(() => console.log('abort presenting'));
        }
      });
      return this.loading;
    },
    dismiss_loader: async (loading) => {
      console.log('loader', this.loadingCtrl);
      this.isLoading = false;
      return await this.loadingCtrl.dismiss();
    }
  };

  getHeaderText(json: boolean = true) {

    const headers = new HttpHeaders()
    .set('Content-Type', 'text/plain');
    return headers;
  }

  prepareRequestBodyText(bodydata: any) {
    console.log('bodydata',bodydata);
    bodydata.os_type = 'android';
    bodydata.os_version = '';
    bodydata.orgId = con.ORG_ID;
    bodydata.contactHierId = con.CONTACT_HIER_ID;
    bodydata.programId = con.PROGRAM_ID;
    bodydata.app_ver = con.APP_VERSION;
    bodydata.APIkey = '96e7f192383ef29f4ba042220aef873a098ba7ff';
    bodydata.deviceId = '';
    this.body = new HttpParams();
    for (const key in bodydata) {
      if (bodydata.hasOwnProperty(key)) {
        this.body = this.body.set(key, bodydata[key]);
      }
    }
    return JSON.stringify(bodydata);
  }

  responseCheck(data: any, key: any) {
    let process = 0;
    if (data.bstatus === 1) {
      process = 1;
    } else {
      if (data.msg_code === 'msg_1202'){
        process = 1;
      } else {
        process = 0;
      }
    }
    console.log('process' + process, this.localItemListData[key]);
    delete this.offlineProcessingKey[key];
    this.dataService.setofflineProKey(this.offlineProcessingKey);
    if (process === 1) {
      delete this.localItemListData[key];
      let saveData = {};
      saveData = this.localItemListData;
      this.Lstorage.setData('todaySyncItem', JSON.stringify(saveData));
      return true;
    } else {
      return false;
    }
  }
}
