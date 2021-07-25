import { Component, OnInit, Input, Injector } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BaseComponent } from '../../_shared/_classes/base.component';

@Component({
  selector: 'headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss'],
})
export class HeadersComponent extends BaseComponent implements OnInit{

  @Input('myText') textToUse;

  headerName: string='';
  text: string;
  iconUrl: any = '';


  constructor(  public navCtrl: NavController,
    injector: Injector) {
      super(injector);
      this.initBaseComponent();
     }

  ngAfterViewInit(){
    this.headerName = this.textToUse;
  }

  ngOnInit() {
    

  }

  logout(){
    this.base.shared.Lstorage.delData('isLogged');
    this.base.shared.Lstorage.delData('access_token');
    this.base.shared.Lstorage.delData('uerId');
    this.navCtrl.navigateRoot('/login');
   // this.router.navigateByUrl('/login', { replaceUrl: true }) ;;
  }

  //ngOnInit() {}

}
