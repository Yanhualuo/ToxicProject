import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  paymentMethods: any[];
  paymentMethod: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  

    this.paymentMethods = [
  //    { method_id: "VISA", method_title: "VISA" },
   //   { method_id: "Discover", method_title: "Discover" },
      { method_id: "cod", method_title: "Cash in Shop" },
      { method_id: "paypal", method_title: "PayPal" }];
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

}
