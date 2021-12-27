import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'change-password-sheet',
    templateUrl: 'change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
    constructor(private _bottomSheetRef: MatBottomSheetRef<ChangePasswordComponent>,
        private authService: AuthService) { }

    passwordForm = new FormGroup({
        oldPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        repeatNewPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, {validators: this.checkPasswords});

    checkPasswords(group: FormGroup) {         
        const pass = group.controls.newPassword.value;
        const confirmPass = group.controls.repeatNewPassword.value;

        return pass === confirmPass ? null : { notSame: true }
    }

    onPasswordChange(): void {
        this.authService.changePassword(this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword);
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }
}