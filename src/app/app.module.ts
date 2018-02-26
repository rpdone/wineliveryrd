import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule }    from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { Dialogs } from '@ionic-native/dialogs';
import { Toast } from '@ionic-native/toast';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ProductPage } from '../pages/product/product';
import { ProductsPage } from '../pages/products/products';
import { SearchPage } from '../pages/search/search';
import { ServicePage } from '../pages/service/service';
import { ProfilePage } from '../pages/profile/profile';
import { PasswordPage } from '../pages/password/password';
import { AddressPage } from '../pages/address/address';
import { HistoryPage } from '../pages/history/history';
import { CartPage } from '../pages/cart/cart';
import { CheckoutPage } from '../pages/checkout/checkout';
import { OrderPage } from '../pages/order/order';
import { TermsPage } from '../pages/terms/terms';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { ForgotPage } from '../pages/forgot/forgot';
import { AboutPage } from '../pages/about/about';
import { SettingsPage } from '../pages/settings/settings';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '0c85e08e',
  },
  'push': {
    'sender_id': '257348328335',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'icon': 'iconotif',
        'iconColor': '#9f151b'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ProductPage,
    ProductsPage,
    SearchPage,
    ServicePage,
    ProfilePage,
    PasswordPage,
    AddressPage,
    HistoryPage,
    CartPage,
    CheckoutPage,
    OrderPage,
    TermsPage,
    WishlistPage,
    ForgotPage,
    AboutPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ProductPage,
    ProductsPage,
    SearchPage,
    ServicePage,
    ProfilePage,
    PasswordPage,
    AddressPage,
    HistoryPage,
    CartPage,
    CheckoutPage,
    OrderPage,
    TermsPage,
    WishlistPage,
    ForgotPage,
    AboutPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Dialogs,
    Toast,
    InAppBrowser,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
