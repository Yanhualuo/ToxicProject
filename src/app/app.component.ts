import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MenuPage } from '../pages/menu/menu';
//import { SignupPage } from '../pages/signup/signup';
import { LoginPage} from '../pages/login/login';
import { HomePage} from '../pages/home/home';
import { OneSignal } from '@ionic-native/onesignal';
import {CheckoutPage} from '../pages/checkout/checkout';
import {LocationPage} from '../pages/location/location';
import {PaymentPage} from '../pages/payment/payment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;//LoginPage;


  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public oneSignal: OneSignal) {
    this.initializeApp();



  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // Application ID, project number
       this.oneSignal.startInit('855f1b57-83cf-459d-b83b-9423273fb078', '839616242222');

       this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

       this.oneSignal.handleNotificationReceived().subscribe(() => {
      //   // do something when notification is received
       });

       this.oneSignal.handleNotificationOpened().subscribe(() => {
      //   // do something when a notification is opened
       });

       this.oneSignal.endInit();


    });
  }

}