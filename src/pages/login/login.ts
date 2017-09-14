import { Component } from '@angular/core';
import { NavController, ModalController, NavParams,ToastController, AlertController, Events} from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import {SignupPage} from '../signup/signup';
import {HomePage} from '../home/home';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    username: string;
    password: string;
    url: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public toastCtrl: ToastController, public storage: Storage, public alertCtrl: AlertController, public events: Events, public modalCtrl: ModalController) {
  
    this.username = "";
    this.password = "";
  }

  login(){

this.http.get("http://thetoxicwings.com/api/auth/generate_auth_cookie/?insecure=cool&username=" + this.username + "&password=" + this.password)
    .subscribe( (res) => {
      console.log(res.json());

      let response = res.json();

      if(response.error){
        this.toastCtrl.create({
          message: response.error,
          duration: 5000
        }).present();
        return;
      }


      this.storage.set("userLoginInfo", response).then( (data) =>{

        this.alertCtrl.create({
          title: "Login Successful",
          message: "You have been logged in successfully.",
          buttons: [{
            text: "OK",
            handler: () => {

              this.events.publish("updateMenu");

              if(this.navParams.get("next")){
                this.navCtrl.push(HomePage);
              } else {
                this.modalCtrl.create(HomePage).present();
              }             
            }
          }]
        }).present();


      })




    });
  //  this.navCtrl.push(HomePage);
  //  this.modalCtrl.create(HomePage).present();

  
  }
  
    
  signup(){
    
    this.navCtrl.push(SignupPage); 
   }

}
