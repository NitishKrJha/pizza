import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Market } from '@ionic-native/market/ngx';
import { RouterStorageService } from '../../_shared/_services/router-storage.service';
import { Router } from '@angular/router';
import * as con from '../../_shared/constant';

@Component({
  selector: 'app-app-update',
  templateUrl: './app-update.page.html',
  styleUrls: ['./app-update.page.scss'],
})
export class AppUpdatePage implements OnInit {

  // // Data passed in by componentProps
  // @Input() appVersionDetails: any;
  public isModal = 0;
  public appVersionDetails: any;
  constructor(
    public mdlCtrl: ModalController,
    public routStorage: RouterStorageService,
    public route: Router,
    private market: Market
  ) {
    console.log('Route data', this.routStorage.storage);
    if (this.routStorage.storage === undefined) {
      this.route.navigate(['/']);
    } else {
      this.isModal = (this.routStorage.storage.is_modal === undefined) ? 0 : 1;
      this.appVersionDetails = this.routStorage.storage.app_version_details;
    }
  }

  public dismissModal() {
    this.mdlCtrl.dismiss();
  }

  public openmarket() {
    if (this.appVersionDetails.package_name !== undefined) {
      this.market.open(this.appVersionDetails.package_name);
    }
  }

  ngOnInit() {
  }

}
