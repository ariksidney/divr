import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NotifiactionsService } from './notifiactions.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: firebase.User;

  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private notifications: NotifiactionsService) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/']);
    } catch (e) {
      console.error(e);
      this.notifications.openSnackBar(e.message);
    }
  }

  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  get uid(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.uid;
  }

  get userDetails(): firebase.User {
    return JSON.parse(localStorage.getItem('user'));
  }

  get profileImgUrl(): string {
    return this.userDetails.photoURL;
  }

  async register(email: string, password: string) {
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
      this.notifications.openSnackBar('Successfully registered :-)');
      this.router.navigate(['login']);
    } catch (e) {
      this.notifications.openSnackBar('Error: ' + e.message);
      console.error(e);
    }
  }

  async loginGoogle() {
      await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      this.router.navigate(['/']);
  }

  isMailAccount(): boolean {
    return this.userDetails.providerData.some(provider => provider.providerId === "password")
  }

  async updateUser(user: firebase.User) {
    try {
      this.user = user;
      const currentUser = await this.afAuth.currentUser;
      await currentUser.updateProfile(user);
      localStorage.setItem('user', JSON.stringify(this.user));
      this.notifications.openSnackBar('Successfully updated profile')
    } catch (e) {
      this.notifications.openSnackBar('Error: ' + e.message);
      console.error(e);
    }
  }

  async changePassword(oldPassword: string, newPassword: string) {
    const user = await this.afAuth.currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
    try {
      await user.reauthenticateWithCredential(credentials);
      await user.updatePassword(newPassword);
      this.notifications.openSnackBar('Successfully changed password')
    } catch (err) {
      console.error(err);
      this.notifications.openSnackBar('Error: ' + err.message);
    }
  }

  async sendVerificationEmail() {
    try {
      const currentUser = await this.afAuth.currentUser;
      await currentUser.sendEmailVerification();
      this.notifications.openSnackBar('Check your mailbox to verify account')
    } catch (err) {
      console.error('Error while sending mail:' + err);
    }
  }

}
