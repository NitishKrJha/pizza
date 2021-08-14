import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, MenuController, ToastController, AlertController, LoadingController, Platform, Events } from '@ionic/angular';
//import { NavigationExtras } from '@angular/router';
import { BaseComponent } from '../../_shared/_classes/base.component';
//import * as con from '../../_shared/constant';
import { LoadingService } from '../../_shared/loading.service';
import * as con from '../../_shared/constant';
@Component({
  selector: 'app-pizza-list',
  templateUrl: './pizza-list.page.html',
  styleUrls: ['./pizza-list.page.scss'],
})
export class PizzaListPage extends BaseComponent implements OnInit {
  access_token:any;
  cId:any;
  category_list:any;
  categoryName:any;
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public events: Events,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    private route: ActivatedRoute,
    public loading: LoadingService,
    injector: Injector
  ) { 
    super(injector);
    this.initBaseComponent();
    
  }
  handleApiResponse(data) { 
    this.loading.dismiss();
    if (data.resultType === con.categoryBaseProduct) {
      this.category_list=data.result.result;
      console.log(data.result.result);
    }
  }

  handleApiResponseError(data) {
    console.log('data', data);
    this.loading.dismiss();
   
  }
  ngOnInit() {
    this.base.shared.Lstorage.fetchData('categoryName').then(categoryName => {
      this.categoryName=categoryName;
      console.log(categoryName)
    });
    this.base.shared.Lstorage.fetchData('access_token').then(datas => {
      this.access_token=datas;
      this.base.shared.Lstorage.fetchData('categoryId').then(cId => {
     this.cId=cId;
      if(!this.access_token){
        this.router.navigateByUrl('login') ;
      }
      let param = {
        'access_token': this.access_token,
        'category_id':cId,
      };
      this.base.api.categoryBaseProduct(param)

      console.log(this.access_token);
    });
  });
  }
  logout(){
    this.base.shared.Lstorage.delData('isLogged');
    this.base.shared.Lstorage.delData('access_token');
    this.base.shared.Lstorage.delData('uerId');
    this.navCtrl.navigateRoot('/login');
   // this.router.navigateByUrl('/login', { replaceUrl: true }) ;;
  }

}
