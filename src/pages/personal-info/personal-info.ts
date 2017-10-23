import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,ModalController} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {LocationPage} from '../location/location';
import {HomePage} from '../home/home';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-personal-info',
  templateUrl: 'personal-info.html',
})
export class PersonalInfoPage {

  WooCommerce: any;
  newOrder: any;
  userInfo: any;
  loggedIn: boolean;
  user: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public storage: Storage, public alertCtrl: AlertController) {
    this.newOrder = {};
    this.user = [];

    this.WooCommerce = WC({
      url: "http://thetoxicwings.com",
      consumerKey: "ck_4f3229f128bcf1e13e1103680750ee5f57386339",
      consumerSecret: "cs_ea9582df02a8e605acdaf5fea72191d1aa6884dd"
    });

    this.storage.get("userLoginInfo").then((userLoginInfo) => {
      if (userLoginInfo != null) {
        // console.log("User logged in...");
         this.userInfo = userLoginInfo.user;
       //  console.log(this.userInfo);
         this.loggedIn = true;

         let email = userLoginInfo.user.email;
         
          this.WooCommerce.getAsync("customers/email/" + email).then((data) => {
         
          this.newOrder = JSON.parse(data.body).customer;
        })
      }
      else {
         console.log("No user found.");
         this.userInfo = {};
         this.loggedIn = false;
      }
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalInfoPage');
  }

  
  logout(){
    this.storage.remove("userLoginInfo").then(() => {
      this.user = {};
      this.loggedIn = false;
    })
     this.modalCtrl.create(HomePage).present();
  }

  openPage(pageName){
    if (pageName == "home"){
        this.modalCtrl.create(HomePage).present();
    }
}
  

}
