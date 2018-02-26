import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { CartPage } from '../cart/cart';
import { WishlistPage } from '../wishlist/wishlist';
import { Dialogs } from '@ionic-native/dialogs';
import { Toast } from '@ionic-native/toast';

declare var $:any;

@Component({
	selector: 'page-address',
	templateUrl: 'address.html',
})

export class AddressPage {

	private apiUrl = "http://www.wineliveryrd.com/rest/v1/";
	private sector_id: string = "Atala";
	private user_id: number;
	private remember_token: string;
	private addresses;
	private sectors;
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
	     		this.getAddresses();
	     	});
	   	});
	}

	getAddresses(){
		let user_id = this.user_id;
		let remember_token = this.remember_token;
		let body = JSON.stringify({ user_id, remember_token });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "getCheckout", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					this.addresses = data.addresses;
					this.sectors = data.sectors;
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
			},
			err => console.error(err)
		);
	}

	createAddress(street, home, number, phone, celphone, next, edit_id){
		var error = false;
		if(street == ""){
			$('input[name=street]').css('border', '1px solid red');
			error = true;
		} else {
			$('input[name=street]').css('border', '');
		}
		if(home == ""){
			$('input[name=home]').css('border', '1px solid red');
			error = true;
		} else {
			$('input[name=home]').css('border', '');
		}
		if(number == ""){
			$('input[name=number]').css('border', '1px solid red');
			error = true;
		} else {
			$('input[name=number]').css('border', '');
		}
		if(phone == ""){
			$('input[name=phone]').css('border', '1px solid red');
			error = true;
		} else {
			$('input[name=phone]').css('border', '');
		}
		if(celphone == ""){
			$('input[name=celphone]').css('border', '1px solid red');
			error = true;
		} else {
			$('input[name=celphone]').css('border', '');
		}
		if(next == ""){
			$('textarea[name=next]').css('border', '1px solid red');
			error = true;
		} else {
			$('textarea[name=next]').css('border', '');
		}
		if(!error){
	  		let user_id = this.user_id;
	  		let remember_token = this.remember_token;
	  		let sector = this.sector_id;
			let body = JSON.stringify({ user_id, remember_token, sector, street, home, number, phone, celphone, next, edit_id });
			let headers = new Headers({ 'Content-Type': 'application/json' });
			let options = new RequestOptions({ headers: headers });
			this.http.post(this.apiUrl + "createAddress", body, options)
			.map((res:Response) => res.json())
			.subscribe(
				data => {
					if(data.status == true){
						$('#addressForm')[0].reset();
						$('input[name=edit_id]').val(0);
						this.sector_id = "Atala";
						this.getAddresses();
					} else {
						this.dialogs.alert(data.message, 'Error', 'Ok');
					}
				},
				err => console.error(err)
			);
		}
	}

	deleteAddress(address_id, element){
  		let user_id = this.user_id;
  		let remember_token = this.remember_token;
		let body = JSON.stringify({ user_id, remember_token, address_id });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(this.apiUrl + "deleteAddress", body, options)
		.map((res:Response) => res.json())
		.subscribe(
			data => {
				if(data.status == true){
					$(element.target).parent().parent().remove();
				} else {
					this.dialogs.alert(data.message, 'Error', 'Ok');
				}
			},
			err => console.error(err)
		);
	}

	editAddress(address){
		this.sector_id = address.sector;
		$('input[name=street]').val(address.calle);
		$('input[name=home]').val(address.residencial);
		$('input[name=number]').val(address.numero);
		$('input[name=phone]').val(address.telefono);
		$('input[name=celphone]').val(address.celular);
		$('textarea[name=next]').val(address.proximo);
		$('input[name=edit_id]').val(address.id);
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
