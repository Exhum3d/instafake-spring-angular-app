import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  authUser: User;
  profileUserId: number;
  profileUser: User;

  constructor() {
  }

  ngOnInit(): void {
  }

}
