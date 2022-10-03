import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './component/layout/layout.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {LoginComponent} from './component/login/login.component';
import {MatCardModule} from "@angular/material/card";
import {SnackBarComponent} from './component/snack-bar/snack-bar.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldControl, MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatChipsModule} from "@angular/material/chips";
import {MatBadgeModule} from "@angular/material/badge";
import {MAT_DATE_FORMATS, MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {ProfileComponent} from './component/profile/profile.component';
import {LogoutComponent} from './component/logout/logout.component';
import {SignupComponent} from './component/signup/signup.component';
import {ViewPhotoDialogComponent} from './component/view-photo-dialog/view-photo-dialog.component';
import {
  FollowingFollowerListDialogComponent
} from './component/following-follower-list-dialog/following-follower-list-dialog.component';
import {ConfirmationDialogComponent} from './component/confirmation-dialog/confirmation-dialog.component';
import {PhotoUploadDialogComponent} from './component/photo-upload-dialog/photo-upload-dialog.component';
import {PostComponent} from './component/post/post.component';
import {PostDialogComponent} from './component/post-dialog/post-dialog.component';
import {AuthGuard} from "./guard/auth.guard";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import { WaitingDialogComponent } from './component/waiting-dialog/waiting-dialog.component';
import { PostCommentDialogComponent } from './component/post-comment-dialog/post-comment-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    SnackBarComponent,
    ProfileComponent,
    LogoutComponent,
    SignupComponent,
    ViewPhotoDialogComponent,
    FollowingFollowerListDialogComponent,
    ConfirmationDialogComponent,
    PhotoUploadDialogComponent,
    PostComponent,
    PostDialogComponent,
    WaitingDialogComponent,
    PostCommentDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
    MatChipsModule,
    MatBadgeModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRippleModule,
    MatTabsModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule
  ],
  providers: [
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
