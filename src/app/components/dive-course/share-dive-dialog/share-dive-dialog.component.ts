import { Location } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'share-dive-dialog',
    templateUrl: 'share-dive-dialog.component.html',
    styleUrls: ['./share-dive-dialog.component.scss']
  })
  export class ShareDiveDialogComponent {

    constructor(private dialogRef: MatDialogRef<ShareDiveDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data,
      private location: Location) { }     

    share() {
      this.dialogRef.close({share: true});
    }
    
    unshare() {
      this.dialogRef.close({share: false});
    }

    get publicDiveUrl() {
      return window.location.href + this.location.prepareExternalUrl(this.data.uid);
    }
  }
  