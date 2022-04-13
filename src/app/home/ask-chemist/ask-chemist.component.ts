import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ask-chemist',
  templateUrl: './ask-chemist.component.html',
  styleUrls: ['./ask-chemist.component.scss']
})
export class AskChemistComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  chemist_array:any=[
    {
      imgurl:"https://chem.washington.edu/sites/chem/files/styles/front_slideshow_alternate/public/images/student-looking-through-microscope-1105x665.jpg?itok=XjWShO_w",
      heading:"Philosophy and Methodology",
      content:"We always seek multi-use over single use chemical solutions "
    },
    {
      imgurl:"https://www.imperial.ac.uk/ImageCropToolT4/imageTool/uploaded-images/141024_imp_chem_026--tojpeg_1455114655644_x2.jpg",
      heading:"Manufacturing Case Studies",
      content:"Ecolink is especially proud of our work with the global mining sector"
    }
  ]
}
