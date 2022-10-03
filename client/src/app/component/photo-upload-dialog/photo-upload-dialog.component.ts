import {Component, Inject, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../model/user.model";
import {SnackBarComponent} from "../snack-bar/snack-bar.component";
import {HttpErrorResponse} from "@angular/common/http";
import {Constants} from "../../shared/constants";

@Component({
  selector: 'app-photo-upload-dialog',
  templateUrl: './photo-upload-dialog.component.html',
  styleUrls: ['./photo-upload-dialog.component.css']
})
export class PhotoUploadDialogComponent implements OnInit {
  photoPreviewUrl: string;
  photo: File;
  defaultProfilePhotoUrl: string = environment.defaultProfilePhotoUrl;
  //defaultCoverPhotoUrl: string = environment.defaultCoverPhotoUrl;

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private userService: UserService,
    private thisDialogRef: MatDialogRef<PhotoUploadDialogComponent>,
    private matSnackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    if (this.data.uploadType === 'image') {
      this.photoPreviewUrl = this.data.authUser.image ? this.data.authUser.image : this.defaultProfilePhotoUrl;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  previewPhoto(e: any): void {
    if (e.target.files) {
      this.photo = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.photo);
      reader.onload = (e: any) => {
        this.photoPreviewUrl = e.target.result;
      }
    }
  }

  savePhoto(): void {
    if (this.photo) {
      if (this.data.uploadType === 'image') {
        this.subscriptions.push(
          this.userService.updateProfilePhoto(this.photo).subscribe({
            next: (updatedUser: User) => {
              this.authService.storeAuthUserInCache(updatedUser);
              this.photoPreviewUrl = null;
              this.matSnackbar.openFromComponent(SnackBarComponent, {
                data: 'Profile photo updated successfully.',
                duration: 5000
              });
              this.thisDialogRef.close({updatedUser});
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
    } else {
      this.matSnackbar.openFromComponent(SnackBarComponent, {
        data: 'Please, first upload a photo to save.',
        panelClass: ['bg-danger'],
        duration: 5000
      });
    }
  };


}
