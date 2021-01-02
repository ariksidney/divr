import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase/app';
import 'firebase/auth';
import { FormGroup, FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: firebase.User;

  profileForm = new FormGroup({
    name: new FormControl(''),
  });

  constructor(private authService: AuthService,
    private _bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    this.user = this.authService.userDetails;
    this.profileForm.value.name = this.user.displayName;
    this.profileForm.patchValue({name: this.user.displayName})
  }

  onProfileUpdate() {
    if (this.profileForm.valid) {
      this.user.displayName = this.profileForm.value.name;
      this.authService.updateUser(this.user);
    }
  }

  openChangePasswordSheet(): void {
    this._bottomSheet.open(ChangePasswordComponent);
  }

  sendVerificationMail(): void {
    this.authService.sendVerificationEmail();
  }

  isVerified() {
    return this.authService.userDetails.emailVerified;
  }

}
