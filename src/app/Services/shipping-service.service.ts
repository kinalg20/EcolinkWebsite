import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class ShippingServiceService {

  constructor(public http: HttpClient, private sanitizer: DomSanitizer) {
    const options = { // set up the default options 
      textKey: 'text', // tag name for text nodes
      attrKey: 'attr', // tag for attr groups
      cdataKey: 'cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
    };
  }


  options: any = {};
  params: any;
  fedextokenurl: string = 'https://apis-sandbox.fedex.com/oauth/token'

  fedextokengeneration(): Promise<any> {
    this.options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    this.params = new HttpParams()
      .set("client_id", "l7df29a700b97d4d079e4b0d3ea2363d32")
      .set("client_secret", "4a80d56001e84d06ac4cdb5efae564d8")
      .set("grant_type", "client_credentials")
      .set("scope", "scope")

    return this.http.post(`${this.fedextokenurl}`, this.params, { headers: this.options }).toPromise();
  }

  fedexshippingurl = 'https://apis-sandbox.fedex.com/rate/v1/rates/quotes'
  fedextoken: string = ''
  requestedPackage: any = [];
  fedexshippingApi(access_token: any, product_details: any, shippingDataObj: any) {
    let product: any;
    product_details.map(async (res: any) => {
      this.requestedPackage = [];
      await res.carts.map((resp: any) => {
        console.log(resp);
        product = {
          "groupPackageCount": resp.quantity,
          "weight": {
            "units": "LB",
            "value": resp.product.weight
          }
        }
        this.requestedPackage.push(product);
      })
    })

    console.log(this.requestedPackage);

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
            "postalCode": 30084,
            "countryCode": "US"
          }
        },
        "recipient": {
          "address": {
            "postalCode": 30030,
            "countryCode": "US",
            "residential": true
          }
        },
        "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
        "serviceType": "GROUND_HOME_DELIVERY",
        "shipmentSpecialServices": {
          "specialServiceTypes": [
            "HOME_DELIVERY_PREMIUM"
          ],
          "homeDeliveryPremiumDetail": {
            "homedeliveryPremiumType": "APPOINTMENT"
          }
        },
        "rateRequestType": [
          "ACCOUNT",
          "LIST"
        ],
        "requestedPackageLineItems": this.requestedPackage
      }
    }

    return this.http.post(this.fedexshippingurl, fedexdata, { headers: httpHeaders })
  }


  rateDetailThroughSaia(checkoutProductList: any) {
    console.log("checkoutProductList", checkoutProductList);
    let url = "http://www.saiasecure.com/webservice/ratequote/soap.asmx";
    let body = `<?xml version="1.0" encoding="utf-8"?>
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
        <OriginCity>Tucker</OriginCity>
        <OriginState>GA</OriginState>
        <OriginZipcode>30085</OriginZipcode>
        <DestinationCity>Tucker</DestinationCity>
        <DestinationState>GA</DestinationState>
        <DestinationZipcode>30085</DestinationZipcode>
        <WeightUnits>KGS</WeightUnits>
        <Details>
          <DetailItem>
            <Weight>${checkoutProductList.weight != undefined ? checkoutProductList.weight : 0}</Weight>
            <Class>50</Class>
          </DetailItem>
        </Details>
      </request>
    </Create>
  </soap:Body>
  </soap:Envelope>`

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'Accept': 'application/xml'
    });
    return this.http.post(url, body, { headers: headers, responseType: 'text' });
  }
}
