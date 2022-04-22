import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-media-banner',
  templateUrl: './media-banner.component.html',
  styleUrls: ['./media-banner.component.scss']
})
export class MediaBannerComponent implements OnInit {
  @Input() data_input:any;
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.data_input.data);
    }, 1000);
  }

}
