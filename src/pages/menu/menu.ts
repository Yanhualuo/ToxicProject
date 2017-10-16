import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController,Events} from 'ionic-angular';
import { HomePage } from '../home/home';
import {SignupPage} from '../signup/signup';
import { ProductsByCategoryPage} from '../products-by-category/products-by-category';
import {LoginPage} from '../login/login';
import { Storage } from '@ionic/storage';
import {CartPage} from '../cart/cart';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  homePage : Component;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCtrl: NavController;
  loggedIn: boolean;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController, public events: Events,private ngZone: NgZone) {
   
   // this.homePage = HomePage
    this.categories = [];
    this.user = [];

    this.WooCommerce = WC({
      url: "http://thetoxicwings.com",
      consumerKey: "ck_4f3229f128bcf1e13e1103680750ee5f57386339",
      consumerSecret: "cs_ea9582df02a8e605acdaf5fea72191d1aa6884dd"
    });

      this.WooCommerce.getAsync("products/categories").then( (data) => {
        this.ngZone.run( ()=>{ 
      console.log(JSON.parse(data.body).product_categories);
   
      let temp: any[] = JSON.parse(data.body).product_categories;

      for (let i = 0; i < temp.length; i++){
        if (temp[i].parent == 0){
/*
          if (temp[i].slug == "sandwich"){
            temp[i].icon = "pizza";
          }
          if (temp[i].slug == "sides"){
            temp[i].icon = "shirt";
          }

          if (temp[i].slug == "wings"){
            temp[i].icon = "leaf";
          }
*/
          this.categories.push(temp[i]);
        }
      }
    })
    }, (err) => {
      console.log(err)
    });
  
    this.events.subscribe("updateMenu", () => {
      this.storage.ready().then(() => {
        this.storage.get("userLoginInfo").then((userLoginInfo) => {

          if (userLoginInfo != null) {

            console.log("User logged in...");
            this.user = userLoginInfo.user;
            console.log(this.user);
            this.loggedIn = true;
          }
          else {
            console.log("No user found.");
            this.user = {};
            this.loggedIn = false;
          }

        })
      });


    })
  }

ionViewDidEnter() {
    this.storage.ready().then(() => {
      this.storage.get("userLoginInfo").then((userLoginInfo) => {
      if (userLoginInfo != null) {
         console.log("User logged in...");
         this.user = userLoginInfo.user;
         console.log(this.user);
         this.loggedIn = true;
      }
      else {
         console.log("No user found.");
         this.user = {};
         this.loggedIn = false;
      }
    })
  })
}

  openCategoryPage(category){

   // this.modalCtrl.create(ProductsByCategoryPage,{"category": category}).present();
    this.navCtrl.push(ProductsByCategoryPage, { "category": category});
  }

  openPage(pageName){
    if (pageName == "home"){
      this.modalCtrl.create(HomePage).present();
    }
    if (pageName == "menu"){
      this.navCtrl.push(MenuPage);
    }
    if (pageName == "logout") {
    
        this.storage.remove("userLoginInfo").then(() => {
        this.user = {};
        this.loggedIn = false;
      })
       this.modalCtrl.create(HomePage).present();
    }
    if (pageName == 'login'){
       this.modalCtrl.create(LoginPage, {next: HomePage}).present();
      //this.navCtrl.push(LoginPage, {next: HomePage})
    }

    if (pageName == 'cart') {
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }

  }
}
