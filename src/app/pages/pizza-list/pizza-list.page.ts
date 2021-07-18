import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, MenuController, ToastController, AlertController, LoadingController, Platform, Events } from '@ionic/angular';
//import { NavigationExtras } from '@angular/router';
import { BaseComponent } from '../../_shared/_classes/base.component';
//import * as con from '../../_shared/constant';
import { LoadingService } from '../../_shared/loading.service';

@Component({
  selector: 'app-pizza-list',
  templateUrl: './pizza-list.page.html',
  styleUrls: ['./pizza-list.page.scss'],
})
export class PizzaListPage extends BaseComponent implements OnInit {

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

  ngOnInit() {
  }
  logout(){
   // console.log('dddddddddddd');
  //  this.navCtrl.navigateRoot('login');
    this.base.shared.Lstorage.delData('isLogged');
    this.base.shared.Lstorage.delData('access_token');
    this.base.shared.Lstorage.delData('uerId');
    this.router.navigateByUrl('logout', { replaceUrl: true }) ;
  }

}
