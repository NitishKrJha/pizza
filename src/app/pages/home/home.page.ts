import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, MenuController, ToastController, AlertController, LoadingController, Platform, Events } from '@ionic/angular';
//import { NavigationExtras } from '@angular/router';
import { BaseComponent } from '../../_shared/_classes/base.component';
//import * as con from '../../_shared/constant';
import { LoadingService } from '../../_shared/loading.service';
import * as con from '../../_shared/constant';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends BaseComponent implements OnInit {
  access_token:any;
  category_list:any;
  constructor( public navCtrl: NavController,
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
      this.base.api.categoryList(param);
    });
  }
  goto(redirectUrl){
    this.navCtrl.navigateRoot(redirectUrl);
  }
  handleApiResponse(data) { 
    this.loading.dismiss();
    if (data.resultType === con.categoryList) {
      this.category_list=data.result.result;
      console.log(data.result.result);
    }
  }

  handleApiResponseError(data) {
    console.log('data', data);
    this.loading.dismiss();
   
  }
  logout(){
    this.base.shared.Lstorage.delData('isLogged');
    this.base.shared.Lstorage.delData('access_token');
    this.base.shared.Lstorage.delData('uerId');
    this.navCtrl.navigateRoot('/login');
   // this.router.navigateByUrl('/login', { replaceUrl: true }) ;;
  }

  goTo(id,name){
  //  console.log(id);
    this.base.shared.Lstorage.setData('categoryId',id);
    this.base.shared.Lstorage.setData('categoryName',name);
    this.router.navigate(['/pizza-list']);
  }

}
