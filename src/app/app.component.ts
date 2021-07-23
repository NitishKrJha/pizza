import { Component, Injector , ViewChildren, QueryList} from '@angular/core';

import {
  Platform,
  NavController,
  ModalController,
  ActionSheetController,
  PopoverController,
  Events,
  MenuController,
  IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { Pages } from './interfaces/pages';
import { BaseComponent } from './_shared/_classes/base.component';
import { LoadingService } from './_shared/loading.service';
import * as con from './_shared/constant';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent extends BaseComponent {
  customerId: any = 0 ;
  public appPages: Array<Pages>;
  cartLogin: any;
  cartItemId: any;
  cartItemTitle: any;
  cartItemPrice: any;
  isLogged: any;
  userData: any = [];
  access_token:any;
  public USER_IMG_PATH = con.IMG_PATH+"user/";
  pictureLink = "assets/images/avatar.jpg";
  picture: any ='';

  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public navCtrl: NavController,
    public network: Network,
    public modalCtrl: ModalController,
    public loading: LoadingService,
    public menu: MenuController,
    public events: Events,
    public actionSheetCtrl: ActionSheetController,
    public popoverCtrl: PopoverController,
    private http: HttpClient,
    injector: Injector
  ) {
    super(injector);
    this.initializeApp();
    /*this.events.subscribe('userLogged', (data) => {
      this.userData = data;
      this.picture = this.userData.picture;
    });*/
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      console.log('show');
      this.base.shared.Lstorage.fetchData('uerId').then(data => {
        console.log('show user id',data);
        if(data){
          console.log('ok',data);
          //this.userDetail(data);
        }
      });
    });
  }

  userDetail(uerId:any = ''){
    const formData = new FormData();
    formData.append('user_id', uerId);
    this.http.post(con.DMS_BASE_URL + 'api/myprofile', formData)
    .pipe(
        finalize(() => {
            console.log('userdetial finalize')
        })
    )
    .subscribe(res => {
        if (res['status'] == true) {
          console.log('res data',res['data'])
          this.events.publish('userLogged',  res['data']);
          this.picture = res['data'].picture;
        } else {
          this.base.shared.Alert.show_alert('Failed!', 'Error while uploading file.');
        }
    });
  }

  login() {
    this.router.navigateByUrl('login', { replaceUrl: true }) ;
  }

  logout() {
    this.base.shared.Lstorage.delData('isLogged');
    this.base.shared.Lstorage.delData('uerId');
    this.router.navigateByUrl('login', { replaceUrl: true }) ;
  }

  goToaddress() {
    this.router.navigateByUrl('/address') ;
  }
  ngOnInit() {
    this.base.shared.Lstorage.fetchData('access_token').then(datas => {
      this.access_token=datas;
      if(!this.access_token){
        this.router.navigateByUrl('login') ;
      }else{
        this.router.navigateByUrl('home') ;
      }

      console.log(this.access_token);
    });
  }

  goCart() {
    this.router.navigateByUrl('/cart') ;
  }

  goTorderList() {
    this.router.navigateByUrl('/orderlist') ;
  }
}
