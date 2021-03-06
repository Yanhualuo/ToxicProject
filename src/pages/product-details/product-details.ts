import { Component } from '@angular/core';
import { NavController, NavParams, } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { CartPage} from '../cart/cart';
import {Storage} from '@ionic/storage';
import { Toast, ToastController, ModalController} from 'ionic-angular';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  product: any;
  wingFavor: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public toastCtrl: ToastController, public modalCtrl:ModalController) {
    
    this.product = this.navParams.get("product");
    console.log(this.product);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  addToCart(product){

    this.storage.get("cart").then((data) => {
      
      if(data == null || data.length == 0){
        data = [];

        data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });
      } else{
        let added = 0;

        for (let i = 0; i < data.length; i++){
          if (product.id == data[i].product.id){
            console.log("Product is already in the cart");

            let qty = data[i].qty;

            data[i].qty = qty + 1;
            data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
            added = 1;
          }
        }

        if (added == 0){
          data.push({
            "product": product,
            "qty":1,
            "amount": parseFloat(product.price)
          });
        }

      }

      this.storage.set("cart", data).then( ()=>{

        console.log("Cart Updated");
        console.log(data);

          this.toastCtrl.create({
          message:"Cart Updated",
          duration:1000,
          position:'top'
        }).present();
      })

    });

  }

  openCart(){

    this.modalCtrl.create(CartPage).present();
  }

}
