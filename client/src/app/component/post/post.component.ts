import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PostResponse} from "../../model/post-response.model";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../service/auth.service";
import {PostService} from "../../service/post.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackBarComponent} from "../snack-bar/snack-bar.component";
import {Constants} from "../../shared/constants";
import {PostDialogComponent} from "../post-dialog/post-dialog.component";
import {WaitingDialogComponent} from "../waiting-dialog/waiting-dialog.component";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postResponse: PostResponse;
  @Input() isDetailedPost: boolean;
  @Output() postDeletedEvent = new EventEmitter<PostResponse>();
  authUserId: number;
  defaultProfilePhotoUrl = environment.defaultProfilePhotoUrl;

  private subscriptions: Subscription[] = [];

  constructor(
    private matDialog: MatDialog,
    private matSnackbar: MatSnackBar,
    private authService: AuthService,
    private postService: PostService) {
  }

  ngOnInit(): void {
    this.authUserId = this.authService.getAuthUserId();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  openLikeDialog(): void {
    // this.matDialog.open(PostLikeDialogComponent, {
    //   data: this.postResponse.post,
    //   minWidth: '400px',
    //   maxWidth: '700px'
    // });
  }

  openCommentDialog(): void {
    // const dialogRef = this.matDialog.open(PostCommentDialogComponent, {
    //   data: this.postResponse.post,
    //   autoFocus: false,
    //   minWidth: '500px',
    //   maxWidth: '700px'
    // });
    //
    // dialogRef.componentInstance.updatedCommentCountEvent.subscribe(
    //   data => this.postResponse.post.commentCount = data
    // );
  }

  openPostEditDialog(): void {
    const dialogRef = this.matDialog.open(PostDialogComponent, {
      data: this.postResponse.post,
      autoFocus: false,
      minWidth: '500px',
      maxWidth: '900px'
    });
  }

  openPostDeleteConfirmDialog(): void {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      data: 'Do you want to delete this post permanently?',
      autoFocus: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) this.deletePost(this.postResponse.post.id);
      }
    );
  }

  deletePost(postId: number): void {
    const dialogRef = this.matDialog.open(WaitingDialogComponent, {
      data: 'Please, wait while we are deleting the post.',
      width: '500px',
      disableClose: true
    });

    this.subscriptions.push(
      this.postService.deletePost(postId).subscribe({
        next: (response: any) => {
          this.postDeletedEvent.emit(this.postResponse);
          dialogRef.close();
          this.matSnackbar.openFromComponent(SnackBarComponent, {
            data: 'Post deleted successfully.',
            panelClass: ['bg-success'],
            duration: 5000
          });
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.matSnackbar.openFromComponent(SnackBarComponent, {
            data: Constants.snackbarErrorContent,
            panelClass: ['bg-danger'],
            duration: 5000
          });
          dialogRef.close();
        }
      })
    );
  }

  likeOrUnlikePost(likedByAuthUser: boolean) {
    if (likedByAuthUser) {
      this.subscriptions.push(
        this.postService.unlikePost(this.postResponse.post.id).subscribe({
          next: (response: any) => {
            this.postResponse.likedByAuthUser = false;
            this.postResponse.post.likeCount--;
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
    } else {
      this.subscriptions.push(
        this.postService.likePost(this.postResponse.post.id).subscribe({
          next: (response: any) => {
            this.postResponse.likedByAuthUser = true;
            this.postResponse.post.likeCount++;
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
}
