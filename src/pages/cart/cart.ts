import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import {Storage} from '@ionic/storage';

import {CheckoutPage} from '../checkout/checkout';
import {LoginPage} from '../login/login';
import {EmptyCartPage} from '../empty-cart/empty-cart';
import {CheckoutNoLoginPage} from '../checkout-no-login/checkout-no-login';
import {PersonalInfoPage} from '../personal-info/personal-info';
import {MenuPage} from '../menu/menu';
import {HomePage} from '../home/home';
import {LocationPage} from '../location/location';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  cartItems: any[] = [];
  total: any;
  showEmptyCartMessage: boolean = false;
  cartItem: any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public storage:Storage, public viewCtrl:ViewController) {
  
    this.total = 0.00;

    this.storage.ready().then( ()=>{

      this.storage.get("cart").then ( (data)=>{
        this.cartItems = data;
        console.log(this.cartItems);

        if (this.cartItems == null){
         this.showEmptyCartMessage = true;
       //  this.navCtrl.push(EmptyCartPage); 
        }

        else{

          this.cartItems.forEach((item, index) => {
            this.total = this.total + (item.product.price * item.qty)

          })
        }

      })
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

  removeFromCart(item, i){

    let price = item.product.price;
    let qty = item.qty;

    this.cartItems.splice(i,1);

    this.storage.set("cart", this.cartItems).then ( ()=>{

      this.total = this.total - (price * qty);
    });

    if (this.cartItems.length == 0){
      this.showEmptyCartMessage = true;
    }

  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  openPage(pageName){

    if (pageName == "menu"){
      this.modalCtrl.create(MenuPage).present();
    }

    if (pageName == "home"){
      this.modalCtrl.create(HomePage).present();
    }

    if (pageName == "checkout"){
      this.storage.get("userLoginInfo").then ((data) =>{
        if (data != null) {
          this.navCtrl.push(LocationPage);
        }
        else{
          this.navCtrl.push(CheckoutNoLoginPage);
        }
      })

    }
  }

}
