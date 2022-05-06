import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private promptEvent: any;
  constructor(public Pwa: PwaService) { 
    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });
  }
  installPwa(): void {
    this.Pwa.promptEvent.prompt();
  }
}
