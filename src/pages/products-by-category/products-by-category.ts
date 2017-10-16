import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import {ProductDetailsPage} from '../product-details/product-details';
//import {MenuSubPage} from '../menu-sub/menu-sub';
import * as WC from 'woocommerce-api';
import {MenuPage} from '../menu/menu';

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,  private ngZone: NgZone) {

    this.page = 1;
    this.category = this.navParams.get("category");

    
      


    this.WooCommerce = WC({
      url: "http://thetoxicwings.com",
      consumerKey: "ck_4f3229f128bcf1e13e1103680750ee5f57386339",
      consumerSecret: "cs_ea9582df02a8e605acdaf5fea72191d1aa6884dd"
    });

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then( (data) => {
      console.log(JSON.parse(data.body));
     
      this.ngZone.run( ()=>{ 
      this.products = JSON.parse(data.body).products;
    })

    }, (err) => {
      console.log(err)
    })
    
     
  

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event){
    this.page++;
    console.log("Getting page " + this.page);
    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then((data) => {
      let temp = (JSON.parse(data.body).products);
    
      this.products = this.products.concat(JSON.parse(data.body).products)
      console.log(this.products);
      event.complete();

      if (temp.length < 10)
        event.enable(false);
  })
}

openProductPage(product){
  
    this.navCtrl.push(ProductDetailsPage,{"product": product});
  }

openMenu(){
  this.modalCtrl.create(MenuPage).present();
}


}
