import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manufacture',
  templateUrl: './manufacture.component.html',
  styleUrls: ['./manufacture.component.scss']
})
export class ManufactureComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  manufacture_array:any=[
    {
      imgurl:"https://www.cheme.washington.edu/sites/cheme/files/about/imgs/test-tubes.jpg",
      heading:"Ecolink Manufacturing",
      content:"ECOLINK AT WORK FOR MANUFACTURING"
    },
    {
      imgurl:"https://www.novartis.com/sites/novartis_com/files/styles/banner_image_1920/public/2021-07/continuous-manufacturing-hero-image.jpg?h=0a3615b4&itok=BbyrXuGQ",
      heading:"Manufacturing Case Studies",
      content:"Ecolink is especially proud of our work with the global mining sector"
    }
  ]

}
