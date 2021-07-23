import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, MenuController, ToastController, AlertController, LoadingController, Platform, Events } from '@ionic/angular';
//import { NavigationExtras } from '@angular/router';
import { BaseComponent } from '../../_shared/_classes/base.component';
//import * as con from '../../_shared/constant';
import { LoadingService } from '../../_shared/loading.service';
import * as con from '../../_shared/constant';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage extends BaseComponent implements OnInit{
  access_token:any;
  name:any;
  mobile:any;
  mail:any;
  constructor(  public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public events: Events,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    private route: ActivatedRoute,
    public loading: LoadingService,
    injector: Injector) {
      super(injector);
      this.initBaseComponent();
     }

  ngOnInit() {
    this.loading.present();
    this.base.shared.Lstorage.fetchData('access_token').then(datas => {
      this.access_token=datas;
      if(!this.access_token){
        this.router.navigateByUrl('login') ;
      }

      let param = {
        'access_token': this.access_token,
        'id':'web',
        'device_type':'android'
      };
      this.base.api.myprofile(param);
    });
    

  }

  handleApiResponse(data) {
    
    this.loading.dismiss();
    if (data.resultType === con.myProfile) {
      this.name=data.result.user.name;
      this.mobile="";
      this.mail=data.result.user.email;
      console.log(data.result.user);
     
    }
  }

  handleApiResponseError(data) {
    console.log('data', data);
    this.loading.dismiss();
    if (data.resultType === con.myProfile) {
      const errorMessage = data.result && data.result.message ? data.result.message : 'Something Went wrong';
      this.base.shared.Alert.show_alert('Failed!', errorMessage);
      this.logout();
    }
  }
  logout(){
    this.base.shared.Lstorage.delData('isLogged');
    this.base.shared.Lstorage.delData('access_token');
    this.base.shared.Lstorage.delData('uerId');
    this.navCtrl.navigateRoot('/login');
   // this.router.navigateByUrl('/login', { replaceUrl: true }) ;;
  }

}
