import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  constructor(private authService: AuthService) { }

  displayNavigation() {
    return this.authService.isLoggedIn;
  }

  getProfileImgUrl(): string {
    return this.authService.profileImgUrl;
  }

  canEditProfile(): boolean {
    return this.authService.isMailAccount();
  }

}
