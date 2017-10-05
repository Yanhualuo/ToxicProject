import { Component, ViewChild ,ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { Http, Response } from '@angular/http';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';

import {PaymentPage} from '../payment/payment';

import {FormsModule} from '@angular/forms';
declare var google;

@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {

  options: GeolocationOptions;
  currentPos: Geoposition;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
 // location=0;
 // locations : Array<any>;
  places : Array<any>;
  place: any;

  constructor(public toastCtrl: ToastController, private http: Http, public navCtrl: NavController, public navParams: NavParams, private geolocation : Geolocation, private actionSheet: ActionSheet) {
      this.getSchedule();
/*
      this.locations = [
          {location_name: "AAA", location_id: "01", location_address:"Abc stress"},
          {location_name: "BBB", location_id: "02", location_address:"cdf ave."}
      ];
      */
  }

ionViewDidEnter(){
  this.getUserPosition();
  
}

addMap(lat,long){

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
    center: latLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


    
    this.getRestaurants(latLng).then((results : Array<any>)=>{
        console.log(results);
        this.places = results;
        for(let i = 0 ;i < results.length ; i++)
        {
            this.createMarker(results[i]);
        }
    },(status)=>console.log(status));

    
    this.addMarker();


}
  
  addMarker(){

    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
    });

    let content = "<p>This is your current position !</p>";          
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });



}

getUserPosition(){
    this.options = {
    enableHighAccuracy : false
    };
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

        this.currentPos = pos;     

        console.log(pos);
        this.addMap(pos.coords.latitude,pos.coords.longitude);
        
    },(err : PositionError)=>{
        console.log("error : " + err.message);
    ;
    })
    //this.addMap(44.0681,-123.1060);
}

getRestaurants(latLng)
{
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
        location : latLng,
        radius : 8047 ,
        name: "Toxic",
        types: ["restaurant"]
    };
    return new Promise((resolve,reject)=>{
        service.nearbySearch(request,function(results,status){
            if(status === google.maps.places.PlacesServiceStatus.OK)
            {
                resolve(results);    
            }else
            {
                reject(status);
            }

        }); 
    });

}

createMarker(place)
  {
   // const G = { "lat":44.0681, "lng": -123.1060 }
    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: place.geometry.location
    });   
  }


  
  
payment(){
    this.navCtrl.push(PaymentPage);
}

selectTime(id){
    console.log(id);

        let buttonLabels = ['11:00-12:00', '12:00-1:00', '1:00-2:00','2:00-3:00','3:00-4:00'];
        
            const options: ActionSheetOptions = {
                title: 'Choose Your Pick-up Time',
              //  subtitle: 'Choose an action',
                buttonLabels: buttonLabels,
                addCancelButtonWithLabel: 'Cancel',
              //  addDestructiveButtonWithLabel: 'Delete',
                destructiveButtonLast: true
            };
        
            this.actionSheet.show(options).then((buttonIndex: number) => {
                console.log('Button pressed: ' + buttonIndex + 'at location:' + id);
            });

     
}

getSchedule(){
    this.http.get("http://thetoxicwings.com/getTimes.php")
    .subscribe( (res) => {
      console.log(res.json());
      console.log(res.json()[0]);

    //id，time1到time10，读取数据方法
      console.log(res.json()[0].id);

      let response = res.json();

      if(response.error){
        this.toastCtrl.create({
          message: response.error,
          duration: 5000
        }).present();
        return;
      }
    });
}


}
