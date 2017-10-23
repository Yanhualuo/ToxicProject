import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import { ProductsByCategoryPage } from '../pages/products-by-category/products-by-category';
import { ProductDetailsPage } from '../pages/product-details/product-details';
import { CartPage } from '../pages/cart/cart';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage} from '../pages/login/login';
import { CheckoutPage} from '../pages/checkout/checkout';
import {EmptyCartPage} from '../pages/empty-cart/empty-cart';
import {LocationPage} from '../pages/location/location';
import {PaymentPage} from '../pages/payment/payment';
import {CheckoutNoLoginPage} from '../pages/checkout-no-login/checkout-no-login';
import {PersonalInfoPage} from '../pages/personal-info/personal-info';

import { HttpModule } from '@angular/http';
import {PayPal} from '@ionic-native/paypal';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Geolocation} from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import {OneSignal} from '@ionic-native/onesignal';
import {ActionSheet} from '@ionic-native/action-sheet';
import { SMS } from '@ionic-native/sms';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MenuPage,
    ProductsByCategoryPage,
    ProductDetailsPage,
    CartPage,
    SignupPage,
    LoginPage,
    CheckoutPage,
    EmptyCartPage,
    LocationPage,
    PaymentPage,
    CheckoutNoLoginPage,
    PersonalInfoPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MenuPage,
    ProductsByCategoryPage,
    ProductDetailsPage,
    CartPage,
    SignupPage,
    LoginPage,
    CheckoutPage,
    EmptyCartPage,
    LocationPage,
    PaymentPage,
    CheckoutNoLoginPage,
    PersonalInfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PayPal,
    Geolocation,
    OneSignal,
    ActionSheet,
    SMS,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
