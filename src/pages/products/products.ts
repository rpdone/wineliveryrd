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
import { LoadingController } from 'ionic-angular';

declare var $:any;

@Component({
	selector: 'page-products',
	templateUrl: 'products.html',
})
export class ProductsPage {

	private apiUrl = "http://www.wineliveryrd.com/rest/v1/";
	private products;
	private categories;
	private countries;
	private regions;
	private user_id: number;
	private remember_token: string;
	private category_id: number = 0;
	private country_id: number = 0;
	private region_id: number = 0;
	private range: string = "0";
	private carts: number;
    private wishs: number;

	constructor(private http: Http, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private dialogs: Dialogs, private toast: Toast, public loadingCtrl: LoadingController) {
		this.category_id = navParams.get('category_id');
		this.wishs = navParams.get('wishs');
        this.carts = navParams.get('carts');
	}

	ionViewDidLoad(){
	  	this.storage.get("user_id").then((val) => {
	     	this.user_id = val;
	     	this.storage.get("remember_token").then((val) => {
	     		this.remember_token = val;
	     		this.getProducts();
	     	});
	   	});
	}

	getProducts(){
		// Loading
		let loading = this.loadingCtrl.create({ content: 'Cargando...'});
		loading.present();
		// End Loading
		let user_id = this.user_id;
		let remember_token = this.remember_token;
		let category_id = this.category_id;
		let country_id = this.country_id;
		let region_id = this.region_id;
		let range = this.range;
		let body = JSON.stringify({ user_id, remember_token, category_id, country_id, region_id, range });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "getProducts", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					this.products = data.products;
					this.categories = data.categories;
					var cid = this.category_id;
					var result = $.grep(this.categories, function(e){ return e.id == cid; });
					if(result[0] && result[0].countries){
						this.countries = result[0].countries;
						var coid = this.country_id;
						if(coid != 0){
							var result = $.grep(this.countries, function(e){ return e.id == coid; });
							if(result[0] && result[0].regions){
								this.regions = result[0].regions;
							}
						}
					}
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
				loading.dismiss();
			},
			err => console.error(err)
		);
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
	
	productSelected(product){
		this.navCtrl.push(ProductPage, {product: product, wishs: this.wishs, carts: this.carts});
	}

    goBack(){
        this.navCtrl.pop();
    }

    goToCart(){
        this.navCtrl.push(CartPage, {wishs: this.wishs, carts: this.carts});
    }

    goToWish(){
        this.navCtrl.push(WishlistPage, {wishs: this.wishs, carts: this.carts});
    }

	createRange(number){
		var items: number[] = [];
		for(var i = 1; i <= number; i++){
			items.push(i);
		}
		return items;
	}

}
