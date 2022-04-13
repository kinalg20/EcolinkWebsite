import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit {
  @Input() showdesc: any;
  constructor() {
  }

  ngOnInit(): void {
  }

}
