import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { ProductPage } from '../product/product';
import { CartPage } from '../cart/cart';
import { WishlistPage } from '../wishlist/wishlist';
import { Dialogs } from '@ionic-native/dialogs';
import { Toast } from '@ionic-native/toast';

@Component({
	selector: 'page-search',
	templateUrl: 'search.html',
})

export class SearchPage {

	private apiUrl = "http://www.wineliveryrd.com/rest/v1/";
	private products;
	private user_id: number;
	private remember_token: string;
	private carts: number;
    private wishs: number;

	constructor(private http: Http, public navCtrl: NavController, private storage: Storage, public navParams: NavParams, private dialogs: Dialogs, private toast: Toast) {
		this.products = navParams.get('products');
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

	productSelected(product){
		this.navCtrl.push(ProductPage, {product: product, wishs: this.wishs, carts: this.carts});
	}

	addToCart(product_id){
		let user_id = this.user_id;
		let remember_token = this.remember_token;
		let body = JSON.stringify({ user_id, remember_token, product_id });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "addToCart", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					this.toast.show(data.message, '5000', 'center').subscribe(toast => { console.log(toast); });
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
			},
			err => console.error(err)
		);
	}

	addToWishlist(product_id){
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
					this.toast.show(data.message, '5000', 'center').subscribe(toast => { console.log(toast); });
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
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

	createRange(number){
		var items: number[] = [];
		for(var i = 1; i <= number; i++){
			items.push(i);
		}
		return items;
	}

}
