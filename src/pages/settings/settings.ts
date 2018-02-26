import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { CartPage } from '../cart/cart';
import { WishlistPage } from '../wishlist/wishlist';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class SettingsPage {

	private apiUrl = "http://www.wineliveryrd.com/rest/v1/";
	private user_id: number;
	private remember_token: string;
    private notifications: boolean = true;
    private carts: number;
    private wishs: number;

	constructor(private http: Http, public navCtrl: NavController, private storage: Storage, public navParams: NavParams) {
        this.wishs = navParams.get('wishs');
        this.carts = navParams.get('carts');
    }

    ionViewDidLoad() {
    	this.storage.get("user_id").then((val) => {
	     	this.user_id = val;
	     	this.storage.get("remember_token").then((val) => {
	     		this.remember_token = val;
	     	});
	     	this.storage.get("notifications").then((val) => {
		     	this.notifications = val;
		   	});
	   	});
    }

    toggleNotifications(){
    	this.storage.set('notifications', this.notifications);
		let user_id = this.user_id;
  		let remember_token = this.remember_token;
  		let notifications = this.notifications;
		let body = JSON.stringify({ user_id, remember_token, notifications });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "updateNotifications", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
				} else {
				}
			},
			err => console.error(err)
		);
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