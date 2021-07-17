import { BaseApiService } from '../_classes/base-api.service';
import { Injectable } from '@angular/core';
import * as con from '../constant';


@Injectable()
export class ApiService extends BaseApiService {

  public registerUrl = con.API_URL + 'register';
  public loginUrl = con.API_URL + 'login';
  public fpwdUrl = con.API_URL + 'fpassword';
  public myProfileUrl = con.API_URL + 'myprofile';
  public editProfileUrl = con.API_URL + 'edit_profile';
  public setPrefrenceUrl = con.API_URL + 'set_prefrence';
  public cpwdUrl = con.API_URL + 'change_password';
  
  public register(params: any = {}) {
    this.genericApiCall(this.registerUrl, con.register, params, con.requestPost, true);
  }

  public login(params: any = {}) {
    this.genericApiCall(this.loginUrl, con.login, params, con.requestPost, true);
  }

  public fPassword(params: any = {}) {
    this.genericApiCall(this.fpwdUrl, con.fPassword, params, con.requestPost, true);
  }

  public myprofile(params: any = {}) {
    this.genericApiCall(this.myProfileUrl, con.myProfile, params, con.requestPost, true);
  }

  public editprofile(params: any = {}) {
    this.genericApiCall(this.editProfileUrl, con.editProfile, params, con.requestPost, true);
  }

  public set_prefrence(params: any = {}) {
    this.genericApiCall(this.setPrefrenceUrl, con.setPrefrence, params, con.requestPost, true);
  }

  public changePassword(params: any = {}) {
    this.genericApiCall(this.cpwdUrl, con.cPassword, params, con.requestPost, true);
  }

}
