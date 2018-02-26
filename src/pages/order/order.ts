import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { CartPage } from '../cart/cart';
import { WishlistPage } from '../wishlist/wishlist';

@Component({
    selector: 'page-order',
    templateUrl: 'order.html',
})
export class OrderPage {

	private user_id: number;
    private remember_token: string;
	private order;
    private carts: number;
    private wishs: number;

    constructor(private http: Http, public navCtrl: NavController, private storage: Storage, public navParams: NavParams, private sanitizer: DomSanitizer) {
        this.order = navParams.get('order');
        this.order.stotal = parseInt(this.order.stotal);
        this.wishs = navParams.get('wishs');
        this.carts = navParams.get('carts');
    }

    ionViewDidLoad(){
        this.storage.get("user_id").then((val) => {
            this.user_id = val;
            this.storage.get("remember_token").then((val) => {
                this.remember_token = val;
            });
        });
    }

    getOrderUrl(){
        return this.sanitizer.bypassSecurityTrustResourceUrl("http://www.wineliveryrd.com/orden-movil/" + this.order.id + "/" + this.order.order_token);
    }

    goTohome(){
  	    this.navCtrl.popToRoot();
    }

    goToCart(){
        this.navCtrl.push(CartPage, {wishs: this.wishs, carts: this.carts});
    }

    goToWish(){
        this.navCtrl.push(WishlistPage, {wishs: this.wishs, carts: this.carts});
    }

    goBack(){
        this.navCtrl.pop();
    }

}
