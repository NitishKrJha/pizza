import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss'],
})
export class HeadersComponent {

  @Input('myText') textToUse;

  headerName = 'Home1';
  text: string;
  iconUrl: any = '';

  constructor(public navCtrl: NavController) {
    this.text = '';
    this.iconUrl = 'assets/images/header-logo.png';
  }

  ngAfterViewInit(){
    this.text = this.textToUse;
    if (this.text === 'giftList') {
      this.iconUrl = 'assets/images/gift2.png';
    } else if (this.text === 'voucherList') {
      this.iconUrl = 'assets/images/voucher3.png';
    }
  }

  //ngOnInit() {}

}
