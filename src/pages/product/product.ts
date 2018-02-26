import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import { CartPage } from '../cart/cart';
import { WishlistPage } from '../wishlist/wishlist';
import { Dialogs } from '@ionic-native/dialogs';
import { Toast } from '@ionic-native/toast';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';

declare var $:any;

@Component({
    selector: 'page-product',
    templateUrl: 'product.html',
})
export class ProductPage {

	private product;
    private stars = 0;
    private apiUrl = "http://www.wineliveryrd.com/rest/v1/";
    private user_id: number;
    private remember_token: string;
    private carts: number;
    private wishs: number;

    constructor(private http: Http, public navCtrl: NavController, private storage: Storage, public navParams: NavParams, private dialogs: Dialogs, private toast: Toast, private iab: InAppBrowser, private socialSharing: SocialSharing) {
  	    this.product = navParams.get('product');
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

    submitStars(){
        let user_id = this.user_id;
        let remember_token = this.remember_token;
        let product_id = this.product.id;
        let stars = this.stars;
        let body = JSON.stringify({ user_id, remember_token, product_id, stars });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl + "submitStars", body, options)
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

    submitReview(review){
        let user_id = this.user_id;
        let remember_token = this.remember_token;
        let product_id = this.product.id;
        let body = JSON.stringify({ user_id, remember_token, product_id, review });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        this.http.post(this.apiUrl + "submitReview", body, options)
        .map((res:Response) => res.json())
        .subscribe(
            data => {
                if(data.status == true){
                    $('textarea[name=review]').val('');
                    this.toast.show(data.message, '5000', 'center').subscribe(toast => { console.log(toast); });
                    this.product.reviews = data.reviews;
                } else {
                    this.dialogs.alert(data.message, 'Error', 'Ok');
                }
            },
            err => console.error(err)
        );
    }

    shareOnFacebook(){
        this.socialSharing.shareViaFacebookWithPasteMessageHint(this.product.title, this.product.image, "http://www.wineliveryrd.com/producto/" + this.product.id, this.product.title);
    }

    shareOnTwitter(){
        this.socialSharing.shareViaTwitter(this.product.title, this.product.image, "http://www.wineliveryrd.com/producto/" + this.product.id);
    }

    setStars(number){
        this.stars = number;
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
