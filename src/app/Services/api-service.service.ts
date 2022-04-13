import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  public _baseurl = environment.api_baseurl;

  constructor(public http: HttpClient , private sanitizer: DomSanitizer) { }

  getAllBlogs(): Observable<any> {
    return this.http.get(this._baseurl + 'getallblogs');
  }
  getBlog(url:string): Observable<any> {
    return this.http.post(this._baseurl+'getblog',{slug:url});
  }

  getAllCategories(): Observable<any> {
    return this.http.get(this._baseurl + 'getCategories');
  }

  getDetailByCategory(slug:any): Observable<any> {
    let url='getCategory';
    return this.http.post<any>(this._baseurl + url, {slug:slug});
  }
  getProductDetail(slug:any): Observable<any> {
    let url='getProduct';
    return this.http.post<any>(this._baseurl + url, {slug:slug});
  }

  getSantizedData(data:any){
    let trustedUrl = this.sanitizer.bypassSecurityTrustHtml(data);
    return trustedUrl;
  }
}

