import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController, Platform, Events } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { BaseComponent } from '../../_shared/_classes/base.component';
import * as con from '../../_shared/constant';
import { LoadingService } from '../../_shared/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BaseComponent implements OnInit  {
  public loginForm: FormGroup;
  phoneNumber: any = '';
  tagHide: any = true;
  phone='';
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
    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
		this.base.shared.Lstorage.fetchData('isLogged').then(datas => {
        if(datas && (datas === 1)) {
          //this.navCtrl.navigateRoot('/home');
        }else{
          this.base.shared.Lstorage.delData('isLogged');
          this.base.shared.Lstorage.delData('uerId');
        }
    });
  }

  register() {
    this.navCtrl.navigateRoot('/register');
  }

  onClickForgotPassword() {
  }

  handleApiResponse(data) {
    this.loading.dismiss();
    if (data.resultType === con.login) {
		  console.log(data.result);
      const successMessage = data.result && data.result.message ? data.result.message : 'something went wrong';
      this.base.shared.Lstorage.setData('isLogged', 1);
      this.base.shared.Lstorage.setData('email', data.result.data.email);
      this.base.shared.Lstorage.setData('uerId', data.result.data.id);
      this.events.publish('userLogged', data.result.data);
      const navigationExtras: NavigationExtras = {
				queryParams: {
					uerId : data.result.data.staff_id
				}
			};
			this.router.navigate(['/home'], navigationExtras);
    }
  }

  handleApiResponseError(data) {
    console.log('data', data);
    this.loading.dismiss();
    if (data.resultType === con.login) {
      const errorMessage = data.result && data.result.message ? data.result.message : 'something went wrong';
      this.base.shared.Alert.show_alert('Failed!', errorMessage);
    }
  }

  doLogin(){
    if (!this.loginForm.valid) {
      this.base.shared.Alert.show_alert('Failed!', 'Please enter a valid details');
    } else {
      this.loading.present();
      this.base.api.login(this.loginForm.value);
    }
  }
  doRegister(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
      }
    };
    this.router.navigate(['register'],navigationExtras);
  }
  fPassword(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
      }
    };
    this.router.navigate(['/login/fpassword'],navigationExtras);
  }
  sendOtp() {
    if (this.phone !== null && this.phone !== '') {
      if (this.phone.length === 10) {
        this.loading.present();
        this.base.api.otpForLogin({phone: this.phone});
      } else {
        this.base.shared.Alert.show_alert('Failed!', ' Please enter 10 digit mobile number');
      }
    } else {
      this.base.shared.Alert.show_alert('Failed!', ' Please enter mobile number first ');
    }
  }
}

