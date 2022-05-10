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
  requestedPackage: any = [];
  fedexshippingApi(access_token: any, product_details: any) {
    let product: any = {};
    product_details.map((res: any) => {
      res.carts.map((resp: any) => {
        product = {};
        product = {
          "groupPackageCount": resp.quantity,
          "weight": {
            "units": 'LB',
            "value": resp.product.weight ? resp.product.weight : 1
          }
        }
        this.requestedPackage.push(product);
      })
    })

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
        // "requestedPackageLineItems": [
        //   {
        //     "groupPackageCount": 3,
        //     "weight": {
        //       "units": 'LB',
        //       "value": 2
        //     }
        //   }
        // ]
      }
    }

    return this.http.post(this.fedexshippingurl, fedexdata, { headers: httpHeaders })
  }


  rateDetailThroughSaia(checkoutProductList: any) {
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
            <Weight>${checkoutProductList.weight}</Weight>
            <Height>${checkoutProductList.height}</Height>
            <Length>${checkoutProductList.length}</Length>
            <Width>${checkoutProductList.width}</Width>
            <Class>50</Class>
          </DetailItem>
        </Details>
      </request>
    </Create>
  </soap:Body>
  </soap:Envelope>`
    // const obj = this.ngxXmlToJsonService.xmlToJson(body, this.options)
    // console.log(obj);
    // const obj1 = JsonToXML.parse("xmlversion", obj, options);
    // console.log(obj1);
    
    // let obj1 = js2xmlparser.parse("person", obj)
    // console.log(obj1);

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8'
    });
    return this.http.post(url, body, { headers: headers, responseType: 'text' });
  }
}
