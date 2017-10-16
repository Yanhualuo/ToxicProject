import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ModalController, NavParams } from 'ionic-angular';
import {ProductDetailsPage} from '../product-details/product-details';
import {CartPage} from '../cart/cart';
import {EmptyCartPage} from '../empty-cart/empty-cart';
import {MenuPage} from '../menu/menu';
import {LoginPage} from '../login/login';
import {LocationPage} from '../location/location';
//import {ProductsByCategoryPage} from '../products-by-category/products-by-category';
import { Storage } from '@ionic/storage';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home', 
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreproducts: any[];
  page: number;
  loggedIn: boolean;
  user: any;
  category: any;
  categories: any[];

  @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public storage: Storage, public navParams: NavParams) {

    this.page = 2;
    this.categories = [];
    this.user = [];
    /*
    this.category = this.navParams.get("category");
*/
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

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then( (data) => {
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    }, (err) => {
      console.log(err)
    });


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

  }


  loadMoreProducts(event){
      if (event == null)
        {
        this.page == 2;
        this.moreproducts = [];
        }
      else
        this.page ++;

      this.WooCommerce.getAsync("products?page=" + this.page).then( (data) => {
      console.log(JSON.parse(data.body));
      this.moreproducts = this.moreproducts.concat(JSON.parse(data.body).products);

      if (event != null){
        event.complete();
      }
    }, (err) => {
      console.log(err)
    })
  }

  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage,{"product": product});
  }

  openCart(){

    this.modalCtrl.create(CartPage).present();
  }

  openPage(pageName){

    if (pageName == "home"){
      this.modalCtrl.create(HomePage).present();
    }
    if (pageName == "menu"){
      this.modalCtrl.create(MenuPage).present();
    }
    if (pageName == "logout") {
    
        this.storage.remove("userLoginInfo").then(() => {
        this.user = {};
        this.loggedIn = false;
      })
       this.modalCtrl.create(HomePage).present();
    }
    if (pageName == 'login'){
       this.modalCtrl.create(LoginPage).present();
    }

    if (pageName == 'cart') {
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }
    
    if (pageName == 'location') {
      this.modalCtrl.create(LocationPage).present();
      
    }


  }
}
