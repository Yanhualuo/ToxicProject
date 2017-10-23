import { Component } from '@angular/core';
import {  NavController, ModalController, NavParams, ToastController, AlertController } from 'ionic-angular';

import {HomePage} from '../home/home';
import {LoginPage} from '../login/login';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  newUser: any = {};
  WooCommerce: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, 
    public alertCtrl: AlertController,public modalCtrl: ModalController) {

    this.newUser.billing_address = {};

  this.WooCommerce = WC({
      url: "http://thetoxicwings.com",
      consumerKey: "ck_4f3229f128bcf1e13e1103680750ee5f57386339",
      consumerSecret: "cs_ea9582df02a8e605acdaf5fea72191d1aa6884dd"
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }


  checkEmail(){

    let validEmail = false;

    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(reg.test(this.newUser.email)){
      //email looks valid

      this.WooCommerce.getAsync('customers/email/' + this.newUser.email).then( (data) => {
        let res = (JSON.parse(data.body));

        if(res.errors){
          validEmail = true;
/*
          this.toastCtrl.create({
            message: "Congratulations. Email is good to go.",
            duration: 3000
          }).present();
*/
        } else {
          validEmail = false;

          this.toastCtrl.create({
            message: "Email already registered. Please check.",
            showCloseButton: true
          }).present();
        }

        console.log(validEmail);

      })



    } else {
      validEmail = false;
      this.toastCtrl.create({
        message: "Invalid Email. Please check.",
        showCloseButton: true
      }).present();
      console.log(validEmail);
    }

  }

  signup(){
    if(this.verifyInput() && this.verifyPassword()){
      console.log("execute login");
      this.signupCallback();
    }
      
  }

    verifyInput(){
      if (this.newUser.first_name == null || this.newUser.last_name == null || this.newUser.email == null ||
      this.newUser.username == null || this.newUser.password == null){
        console.log("null");
        this.popUp("Missing Info", "Please fill all the missing fields...");
        return false;
      }else{
        return true;
      }
    }
    verifyPassword(){
      if (this.newUser.password.length < 6){
        this.popUp("Password Invalid", "Password has to be more than 6 characters");
        return false;
      }else if(this.newUser.password != this.newUser.confirm_password){
        this.popUp("Password Invalid", "Confirm password doesn't match password");
        console.log("not equal")
        return false;
      }else{
        console.log("equal");
        return true;
      }
    }

    //FIXME: uncomment below for release version
    popUp(title, message){
      
      this.alertCtrl.create({
        title: title,
        message: message,
      }).present();
    
    }




    signupCallback(){
      let customerData = {
        customer : {}
      }

      customerData.customer = {
        "email": this.newUser.email,
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "username": this.newUser.username,
        "password": this.newUser.password,
        "billing_address": {
          "first_name": this.newUser.first_name,
          "last_name": this.newUser.last_name,
          "company": "",
          "address_1": this.newUser.billing_address.address_1,
          "address_2": this.newUser.billing_address.address_2,
          "city": this.newUser.billing_address.city,
          "state": this.newUser.billing_address.state,
          "postcode": this.newUser.billing_address.postcode,
          "country": this.newUser.billing_address.country,
          "email": this.newUser.email,
          "phone": this.newUser.billing_address.phone
        },
        
      }

      this.WooCommerce.postAsync('customers', customerData).then( (data) => {

        let response = (JSON.parse(data.body));

        if(response.customer){
          this.alertCtrl.create({
            title: "Account Created",
            message: "Your account has been created successfully! Please login to proceed.",
            buttons: [{
              text: "Login",
              handler: () => {
                if(this.navParams.get("next")){
                this.modalCtrl.create(HomePage).present();
                } else {
                  this.modalCtrl.create(LoginPage).present();
                   }             
                }
            }]
          }).present();
        } else if(response.errors){
          this.toastCtrl.create({
            message: response.errors[0].message,
            showCloseButton: true
          }).present();
        }

      })
    }
    
    openPage(pageName){
      if (pageName == 'home'){
        this.modalCtrl.create(HomePage).present();
      }
    }


}