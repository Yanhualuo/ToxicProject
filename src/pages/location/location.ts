import { Component, ViewChild ,ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController,ModalController } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { Http, Response } from '@angular/http';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import {LoadingController} from 'ionic-angular';
import {PaymentPage} from '../payment/payment';
import {HomePage} from '../home/home';
import {FormsModule} from '@angular/forms';
import { Storage } from '@ionic/storage';
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

  places : Array<any>;
  place: any;

  //location and time variables
  response: any;
  pickupTime = null;
  pickupLocation = null;
  orderCountList:any;
  orderCount=null;
  locationIndex:any;
  timeIndex:any;
  
  //end location and time variables

  constructor(public storage:Storage, public alertCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, private http: Http, public navCtrl: NavController, public navParams: NavParams, private geolocation : Geolocation, private actionSheet: ActionSheet, public loadingCtrl: LoadingController) {
      this.getSchedule();

  }

ionViewDidEnter(){
  this.getUserPosition();
  this.presentLoading();
}

// map loading kind of slow, duration for 4 seconds
presentLoading(){
    let loader = this.loadingCtrl.create({
        content: "Loading...",
        duration: 3000
    });
    loader.present();
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
        name: "Toxic Wings",
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
    //this.setStoreLocationAndTime();
    //this.navCtrl.push(PaymentPage);
    //comment above and uncomment below for release version.
    
    
    if (this.pickupTime == null || this.pickupLocation == null){
        this.alertCtrl.create({
            title: "Missing Info",
            message: "Please Choose Pickup Location and Time",
          }).present();
    }else{
        this.setStoreLocationAndTime();
        this.navCtrl.push(PaymentPage);
    }
    
}
openPage(pageName){
    if (pageName == "home"){
        this.modalCtrl.create(HomePage).present();
    }
}

//below is used for location and time picker/choose/storage
setStoreLocationAndTime(){
    var labelList = ["time1", "time2", "time3", "time4", "time5"];
    var buttonLabels = ['11:00-12:00', '12:00-1:00', '1:00-2:00','2:00-3:00','3:00-4:00'];
    this.storage.set("location", this.pickupLocation);
    var timeColumn;
    for (var i = 0; i< labelList.length; i++){
        if (this.pickupTime == buttonLabels[i]){
            timeColumn = labelList[i];
        }
    }
    this.storage.set("time", timeColumn);
    this.storage.set("count",this.orderCountList[this.timeIndex]-1);
}


selectTime(id){
    this.pickupLocation = id;
    //console.log("before");
    console.log(id);
    //console.log("id");
    //console.log(id=="943 River Road, Eugene");
    //console.log(id=="264 Valley River Center, Eugene");
    var buttonLabels = [];

    if(id=="264 Valley River Center, Eugene"){
        buttonLabels = this.getTimes(0);
        console.log(buttonLabels);
    }else if(id=="943 River Road, Eugene"){
        buttonLabels = this.getTimes(1);
        console.log(buttonLabels);
    }

        //buttonLabels = ['11:00-12:00\naaa', '12:00-1:00', '1:00-2:00','2:00-3:00','3:00-4:00'];
        
            const options: ActionSheetOptions = {
                title: 'Choose Your Pick-up Time',
              //  subtitle: 'Choose an action',
                buttonLabels: buttonLabels,
                addCancelButtonWithLabel: 'Cancel',
              //  addDestructiveButtonWithLabel: 'Delete',
                destructiveButtonLast: true
            };
        
            this.actionSheet.show(options).then((buttonIndex: number) => {
                //console.log('Button pressed: ' + buttonIndex + 'at location:' + id);
                
                //button Index是从1开始的，原因不详@_@
                this.alertCtrl.create({
                    title: "IndexPicked",
                    message: "Index: " + buttonIndex,
                  }).present();
                this.timeIndex = buttonIndex-1;
                this.pickupTime = buttonLabels[buttonIndex-1];
            });

     
}

getSchedule(){
    this.http.get("http://thetoxicwings.com/getTimes.php")
    .subscribe( (res) => {
      console.log("in schedule");
      console.log(res.json());
      console.log(res.json()[0]);

    //id，time1到time10，读取数据方法
      console.log(res.json()[0].id);
      console.log("end schedule");

      this.response = res.json();

      if(this.response.error){
        this.toastCtrl.create({
          message: this.response.error,
          duration: 5000
        }).present();
        return;
      }
    });
    //console.log("in schedule: fsfsfsdf"+ this.response);
    //return this.response;
}

//根据数据生成buttonlabel
//时间表过多时可以使用两个array保存data.time和时间用以简化code
getTimes(number){
    //var buttonLabels = ['11:00-12:00', '12:00-1:00', '1:00-2:00','2:00-3:00','3:00-4:00'];
    this.orderCountList = [];
    var result = [];
    var data:any;
    if (number == 0){
        var data:any = this.response[0];
    }else if (number == 1){
        var data = this.response[1];
    }
    if(parseInt(data.time1) > 0){
        this.alertCtrl.create({
            title: "pushing 11:00-12:00",
            message: "count left: " + data.time1,
          }).present();
        result.push("11:00-12:00");
        this.orderCountList.push(+data.time1);
    }
    if(parseInt(data.time2) > 0){
        result.push("12:00-1:00");
        this.orderCountList.push(+data.time2);
    }
    if(parseInt(data.time3) > 0){
        result.push("1:00-2:00");
        this.orderCountList.push(+data.time3);
    }
    if(parseInt(data.time4) > 0){
        result.push("2:00-3:00");
        this.orderCountList.push(+data.time4);
    }
    if(parseInt(data.time5) > 0){
        result.push("3:00-4:00");
        this.orderCountList.push(+data.time5);
    }
    console.log(result);
    return result;
}


}
