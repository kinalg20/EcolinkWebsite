import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from "@angular/common";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private scroller: ViewportScroller) { }

  ngOnInit(): void {
  }

  scrolldown(event:any){
      this.scroller.scrollToAnchor("newsletter");
  }

  scroll(){
    this.scroller.scrollToAnchor("targetRed");
  }
}
