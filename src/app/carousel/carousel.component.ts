import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  responsiveOptions: any;
  products = [
    {
      name: "A",
      price: "25",
      image: "https://assets.justinmind.com/wp-content/uploads/2019/10/best-graphic-design-blogs.png"
    },
    {
      name: "B",
      price: "25",
      image: "https://assets.justinmind.com/wp-content/uploads/2019/10/best-graphic-design-blogs.png"
    },
    {
      name: "B",
      price: "25",
      image: "https://assets.justinmind.com/wp-content/uploads/2019/10/best-graphic-design-blogs.png"
    },
    {
      name: "B",
      price: "25",
      image: "https://assets.justinmind.com/wp-content/uploads/2019/10/best-graphic-design-blogs.png"
    },
    {
      name: "C",
      price: "25",
      image: "https://assets.justinmind.com/wp-content/uploads/2019/10/best-graphic-design-blogs.png"
    }
  ]
  constructor() {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 2,
        numScroll: 3,
        spacer : 2
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

  }

  ngOnInit(): void {
  }
}
