import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {LoginPage} from '../login/login';
import {SignupPage} from '../signup/signup';
import {CheckoutPage} from '../checkout/checkout';
import {PersonalInfoPage} from '../personal-info/personal-info';

@Component({
  selector: 'page-checkout-no-login',
  templateUrl: 'checkout-no-login.html',
})
export class CheckoutNoLoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutNoLoginPage');
  }

  openPage(pageName){

    if (pageName == 'login'){
      this.navCtrl.push(LoginPage, {next: PersonalInfoPage});
    }
    if (pageName == 'signUp'){
      this.navCtrl.push(SignupPage, {next: PersonalInfoPage});
    }
    if (pageName == 'guess'){
      this.navCtrl.push(PersonalInfoPage);
    }


  }

}
