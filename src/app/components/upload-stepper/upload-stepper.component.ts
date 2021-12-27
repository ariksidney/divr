import { Component, OnInit, ViewChild } from '@angular/core';
import { DiveFileService } from 'src/app/services/dive-file.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-upload-stepper',
  templateUrl: './upload-stepper.component.html',
  styleUrls: ['./upload-stepper.component.scss']
})
export class UploadStepperComponent implements OnInit {

  uploadMsg = '';

  @ViewChild('stepper') private stepper;

  constructor(private diveService: DiveFileService,
    private authService: AuthService) { }

  ngOnInit() {
    this.diveService.uploadFinished.subscribe(finished => {
      if (finished) {
        this.stepper.next();
      }
    })
  }

  onPersist() {
    this.diveService.persist()
      .then(() => this.uploadMsg = 'Dives successfully uploaded!')
      .catch(err => this.uploadMsg = 'Error while uploading dives: ' + err);
  }

  deleteParsedDives() {
    this.diveService.deleteAll();
  }

  isVerified() {
    return this.authService.userDetails.emailVerified;
  }

}
