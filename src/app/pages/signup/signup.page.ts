import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController, Platform, Events } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { BaseComponent } from '../../_shared/_classes/base.component';
import * as con from '../../_shared/constant';
import { LoadingService } from '../../_shared/loading.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage extends BaseComponent implements OnInit  {
  public registrationForm: FormGroup;
  constructor(

    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public events: Events,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public loading: LoadingService,
    injector: Injector
  ) { 
    super(injector);
    this.initBaseComponent();
    this.registrationForm = formBuilder.group({
      fname: ['', Validators.compose([Validators.required])],
      lname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      device_type:'android'
    });
  }

  ngOnInit() {
  }
  handleApiResponse(data) {
    
    this.loading.dismiss();
    if (data.resultType === con.register) {
      console.log(data.result.user);
      this.base.shared.Alert.show_alert('Success!', 'Successfully Register');
     // this.base.shared.Lstorage.setData('access_token',data.result.user.access_token);
      //this.base.shared.Lstorage.setData('uerId',data.result.user.user_id);
      this.navCtrl.navigateRoot('login');
		  /*console.log(data.result);
      const successMessage = data.result && data.result.message ? data.result.message : 'something went wrong';
      this.base.shared.Lstorage.setData('isLogged', 1);
     // this.base.shared.Lstorage.setData('email', data.result.data.email);
      //this.base.shared.Lstorage.setData('uerId', data.result.data.id);
      this.events.publish('userLogged', data.result.data);
      const navigationExtras: NavigationExtras = {
				queryParams: {
					uerId : data.result.data.staff_id
				}
			};
			this.router.navigate(['pizza-list'], navigationExtras);*/
    }
  }

  handleApiResponseError(data) {
    console.log('data', data);
    this.loading.dismiss();
    if (data.resultType === con.register) {
      const errorMessage = data.result && data.result.status.message ? data.result.status.message : 'Something Went Wrong';
      this.base.shared.Alert.show_alert('Failed!', errorMessage);
    }
  }
  doRegister(){
    if (!this.registrationForm.valid) {
      this.base.shared.Alert.show_alert('Failed!', 'Please fill up register form properly');
    } else {
      this.loading.present();
      this.base.api.register(this.registrationForm.value);
    }
  }

}
