import {Component, OnInit} from '@angular/core';
import {PostResponse} from 'src/app/model/post-response.model';
import {User} from "../../model/user.model";
import {Subscription} from "rxjs";
import {UserService} from "../../service/user.service";
import {AuthService} from "../../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserResponse} from "../../model/user-response.model";
import {environment} from "../../../environments/environment";
import {HttpErrorResponse} from "@angular/common/http";
import {Constants} from "../../shared/constants";
import {SnackBarComponent} from "../snack-bar/snack-bar.component";
import {ViewPhotoDialogComponent} from "../view-photo-dialog/view-photo-dialog.component";
import {
  FollowingFollowerListDialogComponent
} from "../following-follower-list-dialog/following-follower-list-dialog.component";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {PhotoUploadDialogComponent} from "../photo-upload-dialog/photo-upload-dialog.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  authUser: User;
  profileUserId: number;
  profileUser: User;
  profileUserPostResponses: PostResponse[] = [];
  isProfileViewerOwner: boolean = false;
  viewerFollowsProfileUser: boolean = false;
  resultPage: number = 1;
  resultSize: number = 5;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  loadingProfile: boolean = false;
  hasNoPost: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog,
    private matSnackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    if (!this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl('/login');
    } else {
      this.loadingProfile = true;
      this.authUser = this.authService.getAuthUserFromCache();

      if (this.activatedRoute.snapshot.paramMap.get('userId') === null) {
        this.isProfileViewerOwner = true;
        this.profileUserId = this.authService.getAuthUserId();
      } else {
        this.profileUserId = Number(this.activatedRoute.snapshot.paramMap.get('userId'));
      }

      this.subscriptions.push(
        this.userService.getUserById(this.profileUserId).subscribe({
          next: (foundUserResponse: UserResponse) => {
            const foundUser: User = foundUserResponse.user;

            if (foundUser.id === this.authUser.id) {
              this.router.navigateByUrl('/profile');
            }

            this.viewerFollowsProfileUser = foundUserResponse.followedByAuthUser;

            if (!foundUser.profileImage) {
              foundUser.profileImage = environment.defaultProfilePhotoUrl
            }

            this.profileUser = foundUser;

            this.loadProfilePosts(1);

            this.loadingProfile = false;
          },
          error: (errorResponse: HttpErrorResponse) => {
            localStorage.setItem(Constants.messageTypeLabel, Constants.errorLabel);
            localStorage.setItem(Constants.messageHeaderLabel, Constants.notFoundErrorHeader);
            localStorage.setItem(Constants.messageDetailLabel, Constants.notFoundErrorDetail);
            localStorage.setItem(Constants.toLoginLabel, Constants.falseLabel);
            this.loadingProfile = false;
            this.router.navigateByUrl('/message');
          }
        })
      );
    }


  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }

  loadProfilePosts(currentPage: number): void {
    if (!this.fetchingResult) {
      this.fetchingResult = true;
      this.subscriptions.push(
        this.userService.getUserPosts(this.profileUserId, currentPage, this.resultSize).subscribe({
          next: (postResponses: PostResponse[]) => {
            postResponses.forEach(post => this.profileUserPostResponses.push(post));
            if (postResponses.length <= 0 && this.resultPage === 1) this.hasNoPost = true;
            if (postResponses.length <= 0) this.hasMoreResult = false;
            this.fetchingResult = false;
            this.resultPage++;
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.matSnackbar.openFromComponent(SnackBarComponent, {
              data: Constants.snackbarErrorContent,
              panelClass: ['bg-danger'],
              duration: 5000
            });
          }
        })
      );
    }
  }

  openFollowingDialog(user: User): void {
    this.matDialog.open(FollowingFollowerListDialogComponent, {
      data: {
        user,
        type: 'following'
      },
      autoFocus: false,
      minWidth: '400px',
      maxWidth: '500px'
    });
  }

  openFollowerDialog(user: User): void {
    this.matDialog.open(FollowingFollowerListDialogComponent, {
      data: {
        user,
        type: 'follower'
      },
      autoFocus: false,
      minWidth: '400px',
      maxWidth: '500px'
    });
  }

  openViewPhotoDialog(photoUrl: string): void {
    this.matDialog.open(ViewPhotoDialogComponent, {
      data: photoUrl,
      autoFocus: false,
      maxWidth: '1200px'
    });
  }

  openFollowConfirmDialog(userId: number): void {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      data: `Do you want to follow ${this.profileUser.firstName + ' ' + this.profileUser.lastName}?`,
      autoFocus: false,
      maxWidth: '500px'
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscriptions.push(
            this.userService.followUser(userId).subscribe({
              next: (response: any) => {
                this.viewerFollowsProfileUser = true;
                this.matSnackbar.openFromComponent(SnackBarComponent, {
                  data: `You are following ${this.profileUser.firstName + ' ' + this.profileUser.lastName}.`,
                  duration: 5000
                });
              },
              error: (errorResponse: HttpErrorResponse) => {
                this.matSnackbar.openFromComponent(SnackBarComponent, {
                  data: Constants.snackbarErrorContent,
                  panelClass: ['bg-danger'],
                  duration: 5000
                });
              }
            })
          );
        }
      }
    );
  }

  openUnfollowConfirmDialog(userId: number): void {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      data: `Do you want to stop following ${this.profileUser.firstName + ' ' + this.profileUser.lastName}?`,
      autoFocus: false,
      maxWidth: '500px'
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscriptions.push(
            this.userService.unfollowUser(userId).subscribe({
              next: (response: any) => {
                this.viewerFollowsProfileUser = false;
                this.matSnackbar.openFromComponent(SnackBarComponent, {
                  data: `You no longer follow ${this.profileUser.firstName + ' ' + this.profileUser.lastName}.`,
                  duration: 5000
                });
              },
              error: (errorResponse: HttpErrorResponse) => {
                this.matSnackbar.openFromComponent(SnackBarComponent, {
                  data: Constants.snackbarErrorContent,
                  panelClass: ['bg-danger'],
                  duration: 5000
                });
              }
            })
          );
        }
      }
    );
  }

  openPhotoUploadDialog(e: Event, uploadType: string): void {
    e.stopPropagation();

    let header: string;
    if (uploadType === 'profilePhoto') {
      header = 'Upload Profile Photo';
    } else if (uploadType === 'coverPhoto') {
      header = 'Upload Cover Photo';
    }

    const dialogRef = this.matDialog.open(PhotoUploadDialogComponent, {
      data: {authUser: this.authUser, uploadType, header},
      autoFocus: false,
      minWidth: '300px',
      maxWidth: '900px',
      maxHeight: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (uploadType === 'profilePhoto') {
          this.profileUser.profileImage = result.updatedUser.profilePhoto;
        }
      }
    });
  }

  handlePostDeletedEvent(postResponse: PostResponse): void {
    document.getElementById(`profilePost${postResponse.post.id}`).remove();
  }


}
