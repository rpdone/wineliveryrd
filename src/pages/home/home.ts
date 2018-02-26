import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { LoginPage } from '../login/login';
import { ProductPage } from '../product/product';
import { ProductsPage } from '../products/products';
import { ServicePage } from '../service/service';
import { SearchPage } from '../search/search';
import { ProfilePage } from '../profile/profile';
import { PasswordPage } from '../password/password';
import { AddressPage } from '../address/address';
import { HistoryPage } from '../history/history';
import { TermsPage } from '../terms/terms';
import { CartPage } from '../cart/cart';
import { WishlistPage } from '../wishlist/wishlist';
import { AboutPage } from '../about/about';
import { SettingsPage } from '../settings/settings';
import { Dialogs } from '@ionic-native/dialogs';
import { Toast } from '@ionic-native/toast';
import { InAppBrowser } from '@ionic-native/in-app-browser';

declare var $:any;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	private apiUrl = "http://www.wineliveryrd.com/rest/v1/";
	private banners;
	private products;
	private inlay_products;
	private special_products;
	private recommended_products;
	private modal;
	private monthly;
	private categories;
	private carts: number;
	private wishs: number;
	private user_id: number;
	private remember_token: string;
	private fromLogin: boolean = false;
	private searching: boolean = false;

	constructor(private http: Http, public navCtrl: NavController, private storage: Storage, private dialogs: Dialogs, private toast: Toast, private iab: InAppBrowser, private navParams: NavParams) {
		this.fromLogin = navParams.get('fromLogin');
	}

	ionViewWillEnter(){
	  	this.storage.get("user_id").then((val) => {
	     	this.user_id = val;
	     	this.storage.get("remember_token").then((val) => {
	     		this.remember_token = val;
	     		this.getHome();
	     	});
	   	});
	}

	getHome(){
		let user_id = this.user_id;
		let remember_token = this.remember_token;
		let body = JSON.stringify({ user_id, remember_token });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "getHome", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					this.banners = data.banners;
					this.products = data.products;
					this.recommended_products = data.recommended_products;
					this.inlay_products = data.inlay_products;
					this.special_products = data.special_products;
					this.monthly = data.monthly;
					this.categories = data.categories;
					this.carts = data.carts;
					this.wishs = data.wishs;
					this.modal = data.modal;
					if(this.fromLogin){
						setTimeout(function(){
							$("#myModal").modal({
								backdrop: false
							});
						}, 100);
						this.fromLogin = false;
					}
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
			},
			err => console.error(err)
		);
	}

	goToPage(number){
		switch (number) {
			case 1:
				this.navCtrl.push(ServicePage, {wishs: this.wishs, carts: this.carts});
				break;
			case 2:
				this.navCtrl.push(ProfilePage, {wishs: this.wishs, carts: this.carts});
				break;
			case 3:
				this.navCtrl.push(PasswordPage, {wishs: this.wishs, carts: this.carts});
				break;
			case 4:
				this.navCtrl.push(AddressPage, {wishs: this.wishs, carts: this.carts});
				break;
			case 5:
				this.navCtrl.push(HistoryPage, {wishs: this.wishs, carts: this.carts});
				break;
			case 6:
				this.navCtrl.push(TermsPage, {wishs: this.wishs, carts: this.carts});
				break;
			case 7:
				this.navCtrl.push(AboutPage, {wishs: this.wishs, carts: this.carts});
				break;
			case 8:
				this.navCtrl.push(SettingsPage, {wishs: this.wishs, carts: this.carts});
				break;
			default:
				break;
		}
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
					this.getHome();
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
					this.getHome();
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
			},
			err => console.error(err)
		);
	}

	goToProducts(category_id){
		this.navCtrl.push(ProductsPage, {category_id: category_id, wishs: this.wishs, carts: this.carts})
	}

	goToCart(){
		this.navCtrl.push(CartPage, {wishs: this.wishs, carts: this.carts});
	}

	goToWish(){
		this.navCtrl.push(WishlistPage, {wishs: this.wishs, carts: this.carts});
	}

	openBanner(url){
		if(url.indexOf("wineliveryrd.com/producto/") != -1){
			var product_id = url.split("/");
			product_id = product_id[product_id.length - 1];
			let user_id = this.user_id;
			let remember_token = this.remember_token;
			let body = JSON.stringify({ user_id, remember_token, product_id });
			let headers = new Headers({ 'Content-Type': 'application/json' });
			let options = new RequestOptions({ headers: headers });
			this.http.post(this.apiUrl + "getProduct", body, options)
			.map((res:Response) => res.json())
			.subscribe(
				data => {
					if(data.status == true){
						this.productSelected(data.product);
					} else {
						this.dialogs.alert(data.message, 'Error', 'Ok');
					}
				},
				err => console.error(err)
			);
		} else {
			this.iab.create(url, "_blank", "zoom=no,closebuttoncaption=Cerrar");
		}
	}

	searchProducts(query){
		if(this.searching == false){
			this.searching = true;
			let user_id = this.user_id;
			let remember_token = this.remember_token;
			let body = JSON.stringify({ user_id, remember_token, query });
			let headers = new Headers({ 'Content-Type': 'application/json' });
			let options = new RequestOptions({ headers: headers });
			this.http.post(this.apiUrl + "searchProducts", body, options)
			.map((res:Response) => res.json())
			.subscribe(
				data => {
					this.searching = false;
					if(data.status == true){
						this.navCtrl.push(SearchPage, {products: data.products, wishs: this.wishs, carts: this.carts});
					} else {
						this.dialogs.alert(data.message, 'Error', 'Ok');
					}
				},
				err => console.error(err)
			);
		}
	}

	logOut(){
		this.storage.clear();
		this.navCtrl.setRoot(LoginPage);
	}

	productSelected(product){
		this.navCtrl.push(ProductPage, {product: product, wishs: this.wishs, carts: this.carts});
	}

	createRange(number){
		var items: number[] = [];
		for(var i = 1; i <= number; i++){
			items.push(i);
		}
		return items;
	}

}
