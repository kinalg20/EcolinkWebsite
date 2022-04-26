import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, ObservableLike, ObservedValueOf } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  public _baseurl = environment.api_baseurl;
  header: any;
  token: any;
  cookiesCheckoutData = new BehaviorSubject<any>([]);
  constructor(public http: HttpClient, private sanitizer: DomSanitizer) { }

  getAllBlogs(): Observable<any> {
    return this.http.get(this._baseurl + 'getallblogs');
  }
  getBlog(url: string): Observable<any> {
    return this.http.post(this._baseurl + 'getblog', { slug: url });
  }
  // registerClient(registerUser:any):Observable<any> {
  //   return this.http.post(this._baseurl+'register',{registerUser});
  // }
  post(data: any): Observable<any> {
    return this.http.post(this._baseurl + 'register', data);
  }
  newLatter(url: any, email: any): Observable<any> {
    return this.http.post(this._baseurl + url, { email: email });
  }
  login(url: any): Observable<any> {
    // const body=JSON.stringify(url);
    return this.http.post(this._baseurl + 'login', url);
  }
  getAllCategories(): Observable<any> {
    return this.http.get(this._baseurl + 'getCategories');
  }

  getDetailByCategory(slug: any): Observable<any> {
    let url = 'getCategory';
    return this.http.post<any>(this._baseurl + url, { slug: slug });
  }
  getProductDetail(slug: any): Observable<any> {
    let url = 'getProduct';
    return this.http.post<any>(this._baseurl + url, { slug: slug });
  }

  addItemToCart(product_id: any, quantity: any, action: any) {
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
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders })
  }
  getItemFromCart() {
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
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders })
  }

  deleteItemFromCart(product_id: any) {
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
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders })
  }

  getCheckoutProducts() {
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
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders })
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


  getWishListItem() {
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
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders })
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
    // this.header = localStorage.getItem('ecolink_user_credential');
    // this.token = JSON.parse(this.header).access_token;
    // const httpHeaders = new HttpHeaders({
    //   'content-type': 'application/json',
    //   'Authorization': `Bearer ${this.token}`
    // })
    let name = {
      name: searchItem
    }

    return this.http.post(this._baseurl + url, name);
  }


  getUserAddress(): Observable<any> {
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
    return this.http.post(this._baseurl + 'getUserAddresses', body, { headers: httpHeaders })
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

  deleteUserAddress(item_id: any): Observable<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    console.log(item_id);
    return this.http.post(this._baseurl + 'deleteUserAddresses', { address_id: item_id }, { headers: httpHeaders })
  }

  filterProduct(dataforfilter: any) {
    let url = 'filterProduct';
    // this.header = localStorage.getItem('ecolink_user_credential');
    // this.token = JSON.parse(this.header).access_token;
    // let user_id = JSON.parse(this.header).user_id;
    // const httpHeaders = new HttpHeaders({
    //   'content-type': 'application/json',
    //   'Authorization': `Bearer ${this.token}`
    // })
    return this.http.post(this._baseurl + url, {
      category: dataforfilter.category,
      price_from: dataforfilter.price_from,
      price_to: dataforfilter.price_to,
      rating: dataforfilter.rating,
      sortby: dataforfilter.sortby
    })
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

  rateDetailThroughSaia() {
    let url = "http://www.saiasecure.com/webservice/ratequote/soap.asmx";
    let body = `
    <?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Create xmlns="http://www.saiasecure.com/WebService/ratequote/">
      <request>
        <UserID>ecolink</UserID>
        <Password>ecolink4</Password>
        <TestMode>Y</TestMode>
        <BillingTerms>Prepaid</BillingTerms>
        <AccountNumber>0747932</AccountNumber>
        <Application>Outbound</Application>
        <OriginCity></OriginCity>
        <OriginState></OriginState>
        <OriginZipcode></OriginZipcode>
        <DestinationCity>Ridgeview</DestinationCity>
        <DestinationState>SD</DestinationState>
        <DestinationZipcode>57652</DestinationZipcode>
        <WeightUnits>KGS</WeightUnits>
        <Details>
          <DetailItem>
            <Width>20.00</Width>
            <Length>20.00</Length>
            <Height>20.00</Height>
            <Weight>20</Weight>
            <Class>50</Class>
          </DetailItem>
          <DetailItem>
            <Width>20.00</Width>
            <Length>20.00</Length>
            <Height>20.00</Height>
            <Weight>20</Weight>
            <Class>50</Class>
          </DetailItem>
        </Details>
      </request>
    </Create>
  </soap:Body>
</soap:Envelope>
    `
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT', 'Access-Control-Allow-Credentials': 'true'
    });
    return this.http.post(url, body, { headers: headers });
  }
  storeOrder(orderObj: any) {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    orderObj.user_id = user_id
    return this.http.post(this._baseurl + 'storeOrder', orderObj, { headers: httpHeaders })
  }
  getOrderData() {
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
    return this.http.post(this._baseurl + 'getOrder', body, { headers: httpHeaders })
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
    console.log("hello")
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    data.user_id = user_id;
    data.profile_image = "https://chirpybazaar.com/wp-content/uploads/2019/05/dummy-man-570x570.png";
    console.log(data);
    return this.http.post(this._baseurl + 'editUserInfo', data, {headers:httpHeaders})
  }

  getProductById(product_id: any) {
    let url = "getProductById";
    return this.http.post(this._baseurl + url, { product_id: product_id })
  }

  fedexshippingApi(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })

    let url = "https://apis-sandbox.fedex.com/oauth/token";

    let tokenGenerationData: any = {
      grant_type: "client_credentials",
      client_id: 'l7df29a700b97d4d079e4b0d3ea2363d32',
      client_secret: '4a80d56001e84d06ac4cdb5efae564d8'
    };

    return this.http.post(url, tokenGenerationData, { headers: httpHeaders })
  }
  forgotPassword(data:any):Observable<any>{
    return this.http.post(this._baseurl+'forgotPassword',data);
  }
  sendResetMail(data:any) : Observable<any> {
    return this.http.post(this._baseurl+ 'forgotPasswordEmail',data)
  }
}

