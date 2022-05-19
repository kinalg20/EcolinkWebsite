import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  public _baseurl = environment.api_baseurl;
  header: any;
  token: any;
  subscribedmsg = new BehaviorSubject<any>({});
  readonly msg$ = this.subscribedmsg.asObservable();
  cookiesCheckoutData = new BehaviorSubject<any>([]);
  itemCountSession = new BehaviorSubject<any>({});
  UserLocation = new BehaviorSubject<any>([]);
  profiledashboard = new BehaviorSubject<boolean>(false);
  constructor(public http: HttpClient, private sanitizer: DomSanitizer) { }

  getAllBlogs(): Observable<any> {
    return this.http.get(this._baseurl + 'getallblogs');
  }
  getBlog(url: string): Observable<any> {
    return this.http.post(this._baseurl + 'getblog', { slug: url });
  }
  post(data: any): Observable<any> {
    return this.http.post(this._baseurl + 'register', data);
  }
  newLatter(url: any, email: any): Observable<any> {
    return this.http.post(this._baseurl + url, { email: email });
  }
  login(url: any): Observable<any> {
    return this.http.post(this._baseurl + 'login', url);
  }
  getAllCategories(): Observable<any> {
    return this.http.get(this._baseurl + 'getCategories');
  }

  getDetailByCategory(slug: any): Promise<any> {
    let url = 'getCategory';
    return this.http.post<any>(this._baseurl + url, { slug: slug }).toPromise();
  }
  getProductDetail(slug: any): Observable<any> {
    let url = 'getProduct';
    return this.http.post<any>(this._baseurl + url, { slug: slug });
  }

  addItemToCart(product_id: any, quantity: any, action: any): Promise<any> {
    let url = 'addCartItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body =
    {
      user_id: user_id,
      product_id: product_id,
      quantity: quantity,
      action: action
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise();
  }
  getItemFromCart(): Promise<any> {
    let url = 'getCartItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body =
    {
      user_id: user_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise()
  }

  deleteItemFromCart(product_id: any): Promise<any> {
    let url = 'deleteCartItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body =
    {
      user_id: user_id,
      product_id: product_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise()
  }

  getCheckoutProducts():Promise<any>{
    let url = 'checkout';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body =
    {
      user_id: user_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise()
  }

  addItemToWishlist(product_id: any) {
    let url = 'addWishlistItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })

    let body = {
      user_id: user_id,
      product_id: product_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders })

  }

  getWishListItem() : Promise<any> {
    let url = 'getWishlistItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })

    let body = {
      user_id: user_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise();
  }

  deleteWishlistItems(product_id: any): Promise<any> {
    let url = 'deleteWishlistItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body =
    {
      user_id: user_id,
      product_id: product_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise();
  }


  getSantizedData(data: any) {
    let trustedUrl = this.sanitizer.bypassSecurityTrustHtml(data);
    return trustedUrl;
  }
  getSantizedUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  home(): Observable<any> {
    return this.http.get(this._baseurl + 'home');
  }

  globalSearchData(searchItem: any) {
    let url = "globalSearch"
    let name = {
      name: searchItem
    }

    return this.http.post(this._baseurl + url, name);
  }


  getUserAddress(): Promise<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      user_id: user_id
    }
    return this.http.post(this._baseurl + 'getUserAddresses', body, { headers: httpHeaders }).toPromise();
  }

  addUserAddresses(data: any): Observable<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    data.user_id = user_id
    return this.http.post(this._baseurl + 'addUserAddresses', data, { headers: httpHeaders })
  }

  getUserProfileDetail(): Observable<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      user_id: user_id
    }
    return this.http.post(this._baseurl + 'userInfo', body, { headers: httpHeaders })
  }

  deleteUserAddress(item_id: any): Promise<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    console.log(item_id);
    return this.http.post(this._baseurl + 'deleteUserAddresses', { address_id: item_id }, { headers: httpHeaders }).toPromise()
  }

  filterProduct(dataforfilter: any):Promise<any> {
    let url = 'filterProduct';
    return this.http.post(this._baseurl + url, {
      category: dataforfilter.category,
      price_from: dataforfilter.price_from,
      price_to: dataforfilter.price_to,
      rating: dataforfilter.rating,
      sortby: dataforfilter.sortby
    }).toPromise();
  }

  editUserAddress(item: any): Observable<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    item.user_id = user_id;
    return this.http.post(this._baseurl + 'editUserAddresses', item, { headers: httpHeaders });
  }

  storeOrder(orderObj: any) {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    orderObj.user_id = user_id;    
    return this.http.post(this._baseurl + 'storeOrder', orderObj, { headers: httpHeaders })
  }

  getOrderData():Promise<any>{
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      user_id: user_id
    }
    return this.http.post(this._baseurl + 'getOrder', body, { headers: httpHeaders }).toPromise();
  }

  CancelOrderApi(id: any): Promise<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })

    let body = {
      id: id,
      user_id: user_id
    }

    return this.http.post(this._baseurl + 'cancelOrder', body , {headers : httpHeaders}).toPromise();
  }
  storeReturnOrder(storeObj: any) {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    storeObj.user_id = user_id
    return this.http.post(this._baseurl + 'storeReturnOrder', storeObj, { headers: httpHeaders })
  }
  getReturnOrder() {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      user_id: user_id
    }
    return this.http.post(this._baseurl + 'getReturnOrder', body, { headers: httpHeaders })
  }
  getPageBySlug(slug: any) {
    let url = 'getPage'
    return this.http.post(this._baseurl + url, { slug: slug })
  }
  submitFormDetail(data: any): Observable<any> {
    return this.http.post(this._baseurl + 'contact', data);
  }
  getUserLogoutProfile(): Observable<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      user_id: user_id
    }

    return this.http.post(this._baseurl + 'logout', body, { headers: httpHeaders })
  }
  editUserProfileInfo(data: any): Observable<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    console.log(user_id);

    data.append("user_id" , user_id)
    // data.profile_image = "https://chirpybazaar.com/wp-content/uploads/2019/05/dummy-man-570x570.png";
    return this.http.post(this._baseurl + 'editUserInfo', data, { headers: httpHeaders })
  }

  getProductById(product_id: any) {
    let url = "getProductById";
    return this.http.post(this._baseurl + url, { product_id: product_id })
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(this._baseurl + 'forgotPassword', data);
  }
  sendResetMail(data: any): Observable<any> {
    return this.http.post(this._baseurl + 'forgotPasswordEmail', data)
  }
  getTaxForUser(pincode: any): Observable<any> {
    let body = {
      zip: 93524
    }
    return this.http.post(this._baseurl + 'getTaxByZip', body)
  }

}

