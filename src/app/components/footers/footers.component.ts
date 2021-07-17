import { Component, OnInit, Input,Injector, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingService } from '../../_shared/loading.service';
import { BaseComponent } from '../../_shared/_classes/base.component';

@Component({
  selector: 'footers',
  templateUrl: './footers.component.html',
  styleUrls: ['./footers.component.scss'],
})
export class FootersComponent extends BaseComponent {
  @Input('myText') textToUse;
  title = 'Footer';
  text: string;
  constructor(
    public navCtrl: NavController,
    public router: Router,
    public loading: LoadingService,
    injector: Injector
  ) {
    super(injector);
    this.text = '';
  }

  ngAfterViewInit(){
    this.text = this.textToUse;
  }

  goProfile() {
    this.router.navigate(['/myprofile']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.loading.present();
    this.base.shared.Lstorage.fetchData('token').then(data => {
      this.base.api.logout({token: data});
    });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
  //ngOnInit() {}

}
