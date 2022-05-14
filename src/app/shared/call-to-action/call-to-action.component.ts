import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.scss']
})
export class CallToActionComponent implements OnInit {
  @Input() data : any=[];
  @ViewChild('height') height:ElementRef|any;
  constructor() { }

  ngOnInit(): void {
  }

  getImageUrl(path: string): string {
    console.log("path");
    return `https://brandtalks.in/ecolinkfrontend/${path}`;
  }
}
