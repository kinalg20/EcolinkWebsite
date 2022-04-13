import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  public _baseurl = environment.api_baseurl;
  header: any;

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

  addItemToCart(product_id: any) {
    let url = 'addCartItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    const access_token = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(this.header).access_token}`);
    // const httpHeaders = new HttpHeaders({
    //   'content-type':'application/json',
    //   'Authorization' : JSON.parse(this.header).access_token
    // })
    let body =
    {
      user_id: 36,
      product_id: 1,
      quantity: 1
    }
    return this.http.post<any>(this._baseurl + url, { headers: access_token})
  }

  getSantizedData(data: any) {
    let trustedUrl = this.sanitizer.bypassSecurityTrustHtml(data);
    return trustedUrl;
  }

  home():Observable<any>{
    return this.http.get(this._baseurl+'home');
  }
}

