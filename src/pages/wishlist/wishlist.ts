import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { ProductPage } from '../product/product';
import { CartPage } from '../cart/cart';
import { Dialogs } from '@ionic-native/dialogs';
import { Toast } from '@ionic-native/toast';

declare var $:any;

@Component({
	selector: 'page-wishlist',
	templateUrl: 'wishlist.html',
})

export class WishlistPage {
	private apiUrl = "http://www.wineliveryrd.com/rest/v1/";
	private user_id: number;
	private remember_token: string;
	private products;
	private carts: number;
    private wishs: number;

	constructor(private http: Http, public navCtrl: NavController, private storage: Storage, private dialogs: Dialogs, private toast: Toast, public navParams: NavParams) {
		this.wishs = navParams.get('wishs');
        this.carts = navParams.get('carts');
	}

	ionViewDidLoad(){
	  	this.storage.get("user_id").then((val) => {
	     	this.user_id = val;
	     	this.storage.get("remember_token").then((val) => {
	     		this.remember_token = val;
	     		this.getWishlist();
	     	});
	   	});
	}

	getWishlist(){
		let user_id = this.user_id;
		let remember_token = this.remember_token;
		let body = JSON.stringify({ user_id, remember_token });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "getWishlist", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					this.products = data.products;
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
			},
			err => console.error(err)
		);
	}

	deleteFromWishlist(product_id, element){
  		let user_id = this.user_id;
  		let remember_token = this.remember_token;
		let body = JSON.stringify({ user_id, remember_token, product_id });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "addToWishlist", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					$(element.target).parent().parent().parent().remove();
					this.getWishlist();
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
			},
			err => console.error(err)
		);
	}

	productSelected(product){
		this.navCtrl.push(ProductPage, {product: product, wishs: this.wishs, carts: this.carts});
	}

	goToCart(){
		this.navCtrl.push(CartPage, {wishs: this.wishs, carts: this.carts});
	}

	goBack(){
		this.navCtrl.pop();
	}
}
