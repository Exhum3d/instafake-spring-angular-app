import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../model/user.model";
import {Subscription} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  authUser: User;
  isUserLoggedIn: boolean = false;
  isProfilePage: boolean = false;
  notifications: Notification[] = [];
  hasUnseenNotification: boolean = false;
  resultPage: number = 1;
  resultSize: number = 5;
  hasMoreNotifications: boolean = false;
  fetchingResult: boolean = false;
  // defaultProfilePhotoUrl = environment.defaultProfilePhotoUrl;

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private matDialog: MatDialog,
    private matSnackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.isUserLoggedIn = true;
      this.authUser = this.authService.getAuthUserFromCache();
    } else {
      this.isUserLoggedIn = false;
    }

    this.authService.logoutSubject.subscribe(loggedOut => {
      if (loggedOut) {
        this.isUserLoggedIn = false;
      }
    });

    this.authService.loginSubject.subscribe(loggedInUser => {
      if (loggedInUser) {
        this.authUser = loggedInUser;
        this.isUserLoggedIn = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // openPostDialog(): void {
  //   this.matDialog.open(PostDialogComponent, {
  //     data: null,
  //     autoFocus: false,
  //     minWidth: '500px',
  //     maxWidth: '700px'
  //   });
  // }

  // openSearchDialog(): void {
  //   this.matDialog.open(SearchDialogComponent, {
  //     autoFocus: true,
  //     width: '500px'
  //   });
  // }
  openPostDialog() {
    console.log("Merge");
  }
}
