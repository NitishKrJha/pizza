import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, MenuController, ToastController, AlertController, LoadingController, Platform, Events } from '@ionic/angular';
//import { NavigationExtras } from '@angular/router';
import { BaseComponent } from '../../_shared/_classes/base.component';
//import * as con from '../../_shared/constant';
import { LoadingService } from '../../_shared/loading.service';
import * as con from '../../_shared/constant';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage extends BaseComponent implements OnInit{
  access_token:any;
  name:any;
  mobile:any;
  mail:any;
  fname:any = '';
  lname:any = '';
  email:any = '';
  phone:any = '';
  user_id: any;
  imagePrefix: any = 'data:image/jpeg;base64,';
  Image:any;
  constructor(  public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public events: Events,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    private route: ActivatedRoute,
    public loading: LoadingService,
    private camera: Camera,
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
      this.fname=data.result.user.name;
      this.lname='';
      this.phone='';
      this.email=data.result.user.email;
      this.mobile="";
      this.mail=data.result.user.email;
      this.user_id = data.result.user.user_id;
      console.log(data.result.user);
     
    }else if (data.resultType === con.editProfile){
      this.base.shared.Lstorage.setData('email', data.result.data.email);
      this.events.publish('userLogged', data.result.data);
      this.router.navigate(['/profile']);
    }
  }

  handleApiResponseError(data) {
    console.log('data', data);
    this.loading.dismiss();
    if (data.resultType === con.myProfile) {
      const errorMessage = data.result && data.result.message ? data.result.message : 'Something Went wrong';
      this.base.shared.Alert.show_alert('Failed!', errorMessage);
      this.logout();
    }else if (data.resultType === con.editProfile){
      const errorMessage = data.result && data.result.message ? data.result.message : 'something went wrong';
      this.base.shared.Alert.show_alert('Failed!', errorMessage);
    }
  }
  logout(){
    this.base.shared.Lstorage.delData('isLogged');
    this.base.shared.Lstorage.delData('access_token');
    this.base.shared.Lstorage.delData('uerId');
    this.navCtrl.navigateRoot('/login');
   // this.router.navigateByUrl('/login', { replaceUrl: true }) ;;
  }

  editProfile(){
    if(this.fname==''){
      this.base.shared.Alert.show_alert('Failed!', 'Please Enter Frist Name');
    }else if(this.lname==''){
      this.base.shared.Alert.show_alert('Failed!', 'Please Enter Last Name'); 
    }else if(this.email==''){
      this.base.shared.Alert.show_alert('Failed!', 'Please Enter Email Address'); 
    }else if(this.phone==''){
      this.base.shared.Alert.show_alert('Failed!', 'Please Enter Mobile Number'); 
    }else {
      this.loading.present();
      this.base.api.editprofile({id: this.user_id,email: this.email, phone: this.phone, fname:this.fname, lname:this.lname});
    }
  }

  openCamera() {
    let self = this;
    let options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      correctOrientation: true,
      targetHeight: 400,
      targetWidth: 400,
      allowEdit: false,
      saveToPhotoAlbum: false,
      sourceType: 1
    };
    this.camera.getPicture(options).then((imageData) => {
      this.Image=imageData;
      console.log('imageData',imageData);
      
    }, (err) => {
      this.base.shared.Alert.show_alert('Failed!',err);
    });
  }

  openFileFromDevice() {
    let self = this;
    let options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetHeight: 400,
      targetWidth: 400,
      allowEdit: false,
      saveToPhotoAlbum: false,
      sourceType: 0
    };
    this.camera.getPicture(options).then((imageData) => {
      this.Image=imageData;
     console.log('imageData',imageData);
    }, (err) => {
      this.base.shared.Alert.show_alert('Failed!',err);
    });
  }


  removeImg(fieldName: string) {
    this.Image = '';
  }

}
