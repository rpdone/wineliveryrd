import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { ProductPage } from '../product/product';
import { CheckoutPage } from '../checkout/checkout';
import { WishlistPage } from '../wishlist/wishlist';
import { Dialogs } from '@ionic-native/dialogs';
import { Toast } from '@ionic-native/toast';

declare var $:any;

@Component({
	selector: 'page-cart',
	templateUrl: 'cart.html',
})

export class CartPage {

	private apiUrl = "http://www.wineliveryrd.com/rest/v1/";
	private user_id: number;
	private remember_token: string;
	private total: number;
	private products;
	private inlay_products;
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
	     		this.getCart();
	     	});
	   	});
	}

	getCart(){
		let user_id = this.user_id;
		let remember_token = this.remember_token;
		let body = JSON.stringify({ user_id, remember_token });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "getCart", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					this.products = data.products;
					this.inlay_products = data.inlay_products;
					this.total = data.total;
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
			},
			err => console.error(err)
		);
	}

	deleteFromCart(product_id, element){
  		let user_id = this.user_id;
  		let remember_token = this.remember_token;
		let body = JSON.stringify({ user_id, remember_token, product_id });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "deleteFromCart", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					$(element.target).parent().parent().parent().remove();
					this.getCart();
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
			},
			err => console.error(err)
		);
	}

	updateCart(product_id, element){
  		let quantity = $(element.target).val();
  		let user_id = this.user_id;
  		let remember_token = this.remember_token;
		let body = JSON.stringify({ user_id, remember_token, product_id, quantity });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "updateCart", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					this.getCart();
					this.toast.show(data.message, '5000', 'center').subscribe(toast => { console.log(toast); });
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

	goToWish(){
		this.navCtrl.push(WishlistPage, {wishs: this.wishs, carts: this.carts});
	}

	goToCheckout(){
		if((this.total + 90) < 1100){
			this.toast.show("Debes tener una orden de un minimo de RD $1,100 pesos para ser procesada.", '5000', 'center').subscribe(toast => { console.log(toast); });
		} else if((this.total + 90) > 20000){
			this.toast.show("Debes tener una orden de un maximo de RD $20,000 pesos para ser procesada.", '5000', 'center').subscribe(toast => { console.log(toast); });
		} else {
			this.navCtrl.push(CheckoutPage, {wishs: this.wishs, carts: this.carts});
		}
	}

	goBack(){
		this.navCtrl.pop();
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
					this.getCart();
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

	createRange(number){
		var items: number[] = [];
		for(var i = 1; i <= number; i++){
			items.push(i);
		}
		return items;
	}

}
