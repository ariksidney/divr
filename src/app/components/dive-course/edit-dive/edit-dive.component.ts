import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormControl } from '@angular/forms';
import { DiveSite } from 'src/app/services/dive';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-edit-dive',
  templateUrl: './edit-dive.component.html',
  styleUrls: ['./edit-dive.component.scss']
})
export class EditDiveComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<EditDiveComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private data: any,
    private authService: AuthService,
    private firestore: FirestoreService) { }

  diveForm = new FormGroup({
    country: new FormControl('', []),
    location: new FormControl('', []),
    name: new FormControl('', []),
    lat: new FormControl('', []),
    long: new FormControl('', []),
  });

  ngOnInit() {
    if (this.data.diveSite) {
      this.diveForm.patchValue({ country: this.data.diveSite.country })
      this.diveForm.patchValue({ location: this.data.diveSite.location })
      this.diveForm.patchValue({ name: this.data.diveSite.name })
      this.diveForm.patchValue({ lat: this.data.diveSite.lat })
      this.diveForm.patchValue({ long: this.data.diveSite.long })
    }
  }

  onDiveChange() {
    const userId = this.authService.user.uid;
    this.firestore.updateDiveSite(userId, this.diveForm.value, this.data.id);
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
