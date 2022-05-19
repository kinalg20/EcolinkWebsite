import { Component, HostListener } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { Loader, LoaderOptions } from 'google-maps';
import { ApiServiceService } from './Services/api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ecolink';
  deferredPrompt: any;
  showButton = false;
  addHomeScreenbtn: boolean = true
  isShow: boolean = true;
  topPosToStartShowing = 100;
  GoogleMapAPIKey: string = 'AIzaSyDG8Z4FQOFQ9ddX0INeSaY11MLRTyr-0Xw'
  constructor(private geolocation: GeolocationService , private _apiService : ApiServiceService) { }
  // @HostListener('window:beforeinstallprompt', ['$event'])
  // onbeforeinstallprompt(e: any) {
  //   console.log(e);
  //   // Prevent Chrome 67 and earlier from automatically showing the prompt
  //   e.preventDefault();
  //   // Stash the event so it can be triggered later.
  //   this.deferredPrompt = e;
  //   this.showButton = true;
  // }
  // @HostListener('window:scroll')
  // checkScroll() {
  //   const scrollPosition =
  //     window.pageYOffset ||
  //     document.documentElement.scrollTop ||
  //     document.body.scrollTop ||
  //     0;

  //   if (scrollPosition >= this.topPosToStartShowing) {
  //     this.isShow = true;
  //   } else {
  //     this.isShow = false;
  //   }
  // }
  ngOnInit() {
    // this.cookiesService.DeleteServiceWorker();
    // this.geolocation$.subscribe(position => {
    //   console.log(position);
    // });
    // localStorage.removeItem('currentAddress')
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let customerLatitude = position.coords.latitude;
        let customerLongitude = position.coords.longitude;
        this.getGeoLocation(customerLatitude, customerLongitude);
      });
    }
    else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  async getGeoLocation(lat: number, lng: number) {

    const options: LoaderOptions = {/* todo */ };
    const loader = new Loader(this.GoogleMapAPIKey, options);

    const google = await loader.load();
    
    if (navigator.geolocation) {
      let geocoder = new google.maps.Geocoder();
      let latlng = new google.maps.LatLng(lat, lng);
      let request: any = { latLng: latlng };
      geocoder.geocode(request, (results: any, status: any) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let result = results[0];
          if (result != null) {
            console.log("Adddres:", result);
            console.log("Adddres:", result.formatted_address);
            this._apiService.UserLocation.next(result.address_components)
          } else {
            alert("No address available!");
          }
        }
      });
    }
  }

  // public addToHomeScreen(): void {
  //   // hide our user interface that shows our A2HS button
  //   this.showButton = false;
  //   // Show the prompt
  //   this.deferredPrompt.prompt();
  //   // Wait for the user to respond to the prompt
  //   this.deferredPrompt.userChoice
  //     .then((choiceResult: any) => {
  //       if (choiceResult.outcome === 'accepted') {
  //         console.log('User accepted the A2HS prompt');
  //         this.addHomeScreenbtn = false;
  //       } else {
  //         console.log('User dismissed the A2HS prompt');
  //       }
  //       this.deferredPrompt = null;
  //     });
  // }
}
