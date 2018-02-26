import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { Push, PushToken } from '@ionic/cloud-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { ForgotPage } from '../forgot/forgot';
import { Dialogs } from '@ionic-native/dialogs';
import { ProductPage } from '../product/product';

declare var $:any;

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	private apiUrl = "http://www.wineliveryrd.com/rest/v1/";
	private user_id: number;
	private remember_token: string;

	constructor(private http: Http, public navCtrl: NavController, private storage: Storage, private dialogs: Dialogs, public push: Push) {
		// This must be changed from ionic notifications to firebase notifications
		this.push.rx.notification().subscribe((msg) => {
			setTimeout(() => {
				this.storage.get("logged_in").then((val) => {
			     	if(val == 'yes'){
						if(msg.app.asleep || msg.app.closed){
							this.storage.get("user_id").then((val) => {
						     	this.user_id = val;
						     	this.storage.get("remember_token").then((val) => {
						     		this.remember_token = val;
						     		var product_id = msg.payload["product_id"];
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
						     	});
						   	});
						}
					}
				});
			}, 500);
		});
	}

	ionViewDidLoad() {
	    this.storage.get("logged_in").then((val) => {
	     	if(val == 'yes'){
	     		// Workaround
	     		this.navCtrl.setRoot(HomePage, {fromLogin: true});
	     		// This must be changed from ionic notifications to firebase notifications
				this.push.register().then((t: PushToken) => {
					return this.push.saveToken(t);
				}).then((t: PushToken) => {
					this.storage.set('push_token', t.token);
					this.navCtrl.setRoot(HomePage, {fromLogin: true});
				});
			}
	   	});
	}

	logIn(email: string, password: string){
		let body = JSON.stringify({ email, password });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "logIn", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					this.storage.set('user_id', data.user_id);
					this.storage.set('user_name', data.user_name);
					this.storage.set('user_lastname', data.user_lastname);
					this.storage.set('remember_token', data.remember_token);
					this.storage.set('logged_in', 'yes');
					this.storage.set('notifications', true);
					// Workaround
					this.navCtrl.setRoot(HomePage, {fromLogin: true});
					// This must be changed from ionic notifications to firebase notifications
					this.push.register().then((t: PushToken) => {
						return this.push.saveToken(t);
					}).then((t: PushToken) => {
						let token = t.token;
						let user_id = data.user_id;
						let remember_token = data.remember_token;
						let body = JSON.stringify({ user_id, remember_token, token });
						let headers = new Headers({ 'Content-Type': 'application/json' });
						let options = new RequestOptions({ headers: headers });
						this.http.post(this.apiUrl + "updateToken", body, options)
						.map((res:Response) => res.json())
						.subscribe(
							data => {
								if(data.status == true){
									this.storage.set('push_token', t.token);
									this.navCtrl.setRoot(HomePage, {fromLogin: true});
								} else {
									this.dialogs.alert(data.message, 'Error', 'Ok');
								}
							},
							err => console.error(err)
						);
					});
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
			},
			err => console.error(err)
		);
	}

	productSelected(product){
		this.navCtrl.push(ProductPage, {product: product});
	}

	goToRegister(){
		this.navCtrl.push(RegisterPage);
	}

	goToForgot(){
		this.navCtrl.push(ForgotPage);
	}

}
