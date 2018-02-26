import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { CartPage } from '../cart/cart';
import { WishlistPage } from '../wishlist/wishlist';

@Component({
	selector: 'page-terms',
	templateUrl: 'terms.html',
})

export class TermsPage {

    private carts: number;
    private wishs: number;

	constructor(private http: Http, public navCtrl: NavController, private storage: Storage, public navParams: NavParams) {
        this.wishs = navParams.get('wishs');
        this.carts = navParams.get('carts');
    }

    ionViewDidLoad() {

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
