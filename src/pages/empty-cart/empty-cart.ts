import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-empty-cart',
  templateUrl: 'empty-cart.html',
})
export class EmptyCartPage {
  
  url: string = 'http://thetoxicwings.com/wp-json/wp/v2/posts';
	items: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmptyCartPage');
  }

  ionViewDidEnter() {
		this.http.get( this.url )
	    .map(res => res.json())
	    .subscribe(data => {
	      // we've got back the raw data, now generate the core schedule data
	      // and save the data for later reference
        this.items = data;
        console.log(data.content);
	    });
	}



}
