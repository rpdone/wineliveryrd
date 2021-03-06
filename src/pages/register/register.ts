import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { Push, PushToken } from '@ionic/cloud-angular';
import { HomePage } from '../home/home';
import { Dialogs } from '@ionic-native/dialogs';

@Component({
	selector: 'page-register',
	templateUrl: 'register.html',
})

export class RegisterPage {

	private apiUrl = "http://www.wineliveryrd.com/rest/v1/";

	constructor(private http: Http, public navCtrl: NavController, private storage: Storage, private dialogs: Dialogs, public push: Push) {}

	ionViewDidLoad() {}

	signUp(name: string, lastname: string, email: string, password: string, cpassword: string){
  		if(password == cpassword){
			let body = JSON.stringify({ name, lastname, email, password });
			let headers = new Headers({ 'Content-Type': 'application/json' });
			let options = new RequestOptions({ headers: headers });
			this.http.post(this.apiUrl + "signUp", body, options)
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
		} else {
			this.dialogs.alert("La contraseña no coincide", 'Error', 'Ok');
		}
	}

	goToLogin(){
		this.navCtrl.popToRoot();
	}

}