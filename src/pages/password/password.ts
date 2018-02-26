import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { CartPage } from '../cart/cart';
import { WishlistPage } from '../wishlist/wishlist';
import { Dialogs } from '@ionic-native/dialogs';
import { Toast } from '@ionic-native/toast';

@Component({
	selector: 'page-password',
	templateUrl: 'password.html',
})
export class PasswordPage {

	private apiUrl = "http://www.wineliveryrd.com/rest/v1/";
	private user_id: number;
	private remember_token: string;
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
	     	});
	   	});
	}

	changePassword(password, cpassword){
  		if(password == cpassword){
	  		let user_id = this.user_id;
	  		let remember_token = this.remember_token;
			let body = JSON.stringify({ user_id, remember_token, password });
			let headers = new Headers({ 'Content-Type': 'application/json' });
			let options = new RequestOptions({ headers: headers });
			this.http.post(this.apiUrl + "updatePassword", body, options)
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
		} else {
			this.dialogs.alert("La contraseña no coincide", 'Error', 'Ok');
		}
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
