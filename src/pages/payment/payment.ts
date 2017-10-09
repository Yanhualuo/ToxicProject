import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Response, URLSearchParams, Headers } from '@angular/http';
import * as WC from 'woocommerce-api';

// import { HomePage } from '../home/home';
// import { Menu } from '../menu/menu';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  WooCommerce: any;
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userInfo: any;
  
  //used for reward program
  rewardPoint: any;

  showPaymentSection: boolean = false;

  constructor(public toastCtrl: ToastController, private http: Http, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController, public payPal: PayPal) {
    this.newOrder = {};
    this.newOrder.billing_address = {};
    this.newOrder.shipping_address = {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
     // { method_id: "VISA", method_title: "VISA" },
     // { method_id: "Discover", method_title: "Discover" },
      { method_id: "cod", method_title: "Cash in Shop" },
      { method_id: "paypal", method_title: "PayPal" }];

    this.WooCommerce = WC({
      url: "http://thetoxicwings.com",
      consumerKey: "ck_4f3229f128bcf1e13e1103680750ee5f57386339",
      consumerSecret: "cs_ea9582df02a8e605acdaf5fea72191d1aa6884dd"
    });

    this.storage.get("userLoginInfo").then((userLoginInfo) => {

      this.userInfo = userLoginInfo.user;

      let email = userLoginInfo.user.email;

      this.WooCommerce.getAsync("customers/email/" + email).then((data) => {

        this.newOrder = JSON.parse(data.body).customer;

      })

    })


    //test usage
    this.getPoint("aaa@gmail.com");
    this.setPoint("aa@gmail.com", 10);
  }

  placeOrder() {

    let orderItems: any[] = [];
    let data: any = {};

    let paymentData: any = {};

    this.paymentMethods.forEach((element, index) => {
      if (element.method_id == this.paymentMethod) {
        paymentData = element;
      }
    });


    data = {
      payment_details: {
        method_id: paymentData.method_id,
        method_title: paymentData.method_title,
        paid: true
      },

      billing_address: this.newOrder.billing_address,
      customer_id: this.userInfo.id || '',
      line_items: orderItems
    };


    if (paymentData.method_id == "paypal") {
      this.payPal.init({
        PayPalEnvironmentProduction: "YOUR_PRODUCTION_CLIENT_ID",
        PayPalEnvironmentSandbox: "AVpM_CjmadoaK2Gy4llZ2swc00II35LUrrKvkkX1ZQZwZ_N48AVPDyQ6d8BiIcJhSWaqkVTZH-OVOo8D"
      }).then(() => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({

        })).then(() => {

          this.storage.get("cart").then((cart) => {

            let total = 0.00;
            cart.forEach((element, index) => {
              orderItems.push({ product_id: element.product.id, quantity: element.qty });
              total = total + (element.product.price * element.qty);
            });

            let payment = new PayPalPayment(total.toString(), 'USD', 'Description', 'sale');
            this.payPal.renderSinglePaymentUI(payment).then((response) => {
              // Successfully paid

              alert(JSON.stringify(response));


              data.line_items = orderItems;
              //console.log(data);
              let orderData: any = {};

              orderData.order = data;

              this.WooCommerce.postAsync('orders', orderData).then((data) => {
                alert("Order placed successfully!");

                let response = (JSON.parse(data.body).order);

                this.alertCtrl.create({
                  title: "Order Placed Successfully",
                  message: "Your order has been placed successfully. Your order number is " + response.order_number,
                  buttons: [{
                    text: "OK",
                    handler: () => {
                      this.navCtrl.push('HomePage');
                    }
                  }]
                }).present();
              })

            })

          }, () => {
            // Error or render dialog closed without being successful
          });
        }, () => {
          // Error in configuration
        });
      }, () => {
        // Error in initialization
      });



//TODO

    } else {

      this.storage.get("cart").then((cart) => {

        cart.forEach((element, index) => {
          orderItems.push({
            product_id: element.product.id,
            quantity: element.qty
          });
        });

        data.line_items = orderItems;

        let orderData: any = {};

        orderData.order = data;

        this.WooCommerce.postAsync("orders", orderData).then((data) => {

          let response = (JSON.parse(data.body).order);

          this.alertCtrl.create({
            title: "Order Placed Successfully",
            message: "Your order has been placed successfully. Your order number is " + response.order_number,
            buttons: [{
              text: "OK",
              handler: () => {
                this.navCtrl.setRoot('HomePage');
              }
            }]
          }).present();

        })

      })

    }

  }

  //get reward point from database.
  getPoint(email){
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append("user_email", email);
    let body = urlSearchParams.toString();
    let body1 = {user_name: 'aaa@gmail.com'};
    this.http.post('http://thetoxicwings.com/getPoints.php', body, {headers : headers})
        .subscribe(
          (res) =>{
            let temp = res.json()[0].user_status;
            //convert string to number
            this.rewardPoint = +temp;
          }
        );
  }
    
  //update reward poiint to databse
  setPoint(email, point){
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append("user_email", email);
    urlSearchParams.append("user_status", point);
    let body = urlSearchParams.toString();
    this.http.post('http://thetoxicwings.com/setPoints.php', body, {headers : headers})
        .subscribe(
          /*
          (res) =>{
            this.rewardPoint = +res.json()[0].user_status;
            this.rewardPoint++;
            console.log(res.json()[0].user_status);
            console.log("reward: ");
          }
          */
        );
          
  }

    

}