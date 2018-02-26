import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { CartPage } from '../cart/cart';
//import { OrderPage } from '../order/order';
import { WishlistPage } from '../wishlist/wishlist';
import { Dialogs } from '@ionic-native/dialogs';
import { Toast } from '@ionic-native/toast';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
	selector: 'page-history',
	templateUrl: 'history.html',
})
export class HistoryPage {

	private apiUrl = "http://www.wineliveryrd.com/rest/v1/";
	private orders;
	private user_id: number;
	private remember_token: string;
	private filter: number = 1;
	private carts: number;
    private wishs: number;

	constructor(private http: Http, public navCtrl: NavController, private storage: Storage, private dialogs: Dialogs, private toast: Toast, private iab: InAppBrowser, public navParams: NavParams) {
		this.wishs = navParams.get('wishs');
        this.carts = navParams.get('carts');
	}

	ionViewWillEnter(){
	  	this.storage.get("user_id").then((val) => {
	     	this.user_id = val;
	     	this.storage.get("remember_token").then((val) => {
	     		this.remember_token = val;
	     		this.getHistory();
	     	});
	   	});
	}

	getHistory(){
		let filter = this.filter;
		let user_id = this.user_id;
		let remember_token = this.remember_token;
		let body = JSON.stringify({ user_id, remember_token, filter });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "getHistory", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					this.orders = data.orders;
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
			},
			err => console.error(err)
		);
	}

	orderSelected(order){
		var iabRef = this.iab.create("http://www.wineliveryrd.com/orden-movil/" + order.id + "/" + order.order_token, "_blank", "location=no,zoom=no,closebuttoncaption=Cerrar");
		iabRef.on("exit").subscribe(
			() => {
				this.getHistory();
			},
			err => {
				console.log(err);
			}
		)
		//this.navCtrl.push(OrderPage, {order: order, wishs: this.wishs, carts: this.carts});
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
