import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// All comment out import are just for testing purpose!

import { MenuPage } from '../pages/menu/menu';
//import { SignupPage } from '../pages/signup/signup';
//import { LoginPage} from '../pages/login/login';
import { HomePage} from '../pages/home/home';
import { OneSignal } from '@ionic-native/onesignal';
import {CartPage} from '../pages/cart/cart';
//import {CheckoutPage} from '../pages/checkout/checkout';
//import {LocationPage} from '../pages/location/location';
//import {PaymentPage} from '../pages/payment/payment';
//import {PersonalInfoPage} from '../pages/personal-info/personal-info';
//import {EmptyCartPage} from '../pages/empty-cart/empty-cart';
import * as WC from 'woocommerce-api';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  WooCommerce: any;
  rootPage: any = HomePage;//EmptyCartPage;//LoginPage;


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
/*
    this.WooCommerce = WC({
      url: "http://thetoxicwings.com",
      consumerKey: "ck_4f3229f128bcf1e13e1103680750ee5f57386339",
      consumerSecret: "cs_ea9582df02a8e605acdaf5fea72191d1aa6884dd"
    });

    this.WooCommerce.getAsync("products/categories").then( (data) => {
      console.log(JSON.parse(data.body).product_categories);

      let temp: any[] = JSON.parse(data.body).product_categories;
    }, (err) => {
      console.log(err)
    });
*/
  }

}