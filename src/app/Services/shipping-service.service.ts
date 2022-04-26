import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ShippingServiceService {

  constructor(public http: HttpClient, private sanitizer: DomSanitizer) { }


  options: any = {};
  params: any;
  fedextokenurl: string = 'https://apis-sandbox.fedex.com/oauth/token'

  fedextokengeneration(): Observable<any> {
    this.options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    this.params = new HttpParams()
      .set("client_id", "l7df29a700b97d4d079e4b0d3ea2363d32")
      .set("client_secret", "4a80d56001e84d06ac4cdb5efae564d8")
      .set("grant_type", "client_credentials")
      .set("scope", "scope")

    return this.http.post(`${this.fedextokenurl}`, this.params, { headers: this.options })
  }

  fedexshippingurl = 'https://apis-sandbox.fedex.com/rate/v1/rates/quotes'
  fedextoken: string = ''
  fedexshippingApi(access_token: any , product_details : any) {
    // console.log(product_details);
    this.fedextoken = access_token;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.fedextoken}`
    })
    let fedexdata = {
      "accountNumber": {
        "value": "740561073"
      },
      "requestedShipment": {
        "shipper": {
          "address": {
            "postalCode": 8099,
            "countryCode": "CH"
          }
        },
        "recipient": {
          "address": {
            "postalCode": 2116,
            "countryCode": "AU"
          }
        },
        "shipDateStamp": "2020-07-03",
        "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
        "serviceType": "INTERNATIONAL_PRIORITY",
        "rateRequestType": [
          "LIST",
          "ACCOUNT"
        ],
        "customsClearanceDetail": {
          "dutiesPayment": {
            "paymentType": "SENDER",
            "payor": {
              "responsibleParty": null
            }
          },
          "commodities": [
            {
              "description": "Camera",
              "quantity": 1,
              "quantityUnits": "PCS",
              "weight": {
                "units": "KG",
                "value": 11
              },
              "customsValue": {
                "amount": 100,
                "currency": "SFR"
              }
            }
          ]
        },
        "requestedPackageLineItems": [
          {
            "groupPackageCount": 2,
            "weight": {
              "units": "KG",
              "value": 1
            }
          },
          {
            "groupPackageCount": 3,
            "weight": {
              "units": "KG",
              "value": 10
            }
          }
        ]
      }
    }

    return this.http.post(this.fedexshippingurl, fedexdata, { headers: httpHeaders })
  }
}
