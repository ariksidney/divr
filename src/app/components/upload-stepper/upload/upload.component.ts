import { Component } from '@angular/core';
import { DiveFileService } from 'src/app/services/dive-file.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  dropzoneActive = false;
  isProcessing = false;

  constructor(private diveFileService: DiveFileService,
    private auth: AuthService) { }

    dropzoneState($event: boolean) {
      this.dropzoneActive = $event;
    }

    handleDrop(fileList: FileList) {
    if (fileList.length !== 1) {
      console.error('More than one file uploaded');
    } else if (!fileList[0].name.endsWith('.xml')) {
      console.error('File is not a .xml file');
    } else {
      this.diveFileService.handleDiveFile(fileList[0]);
      this.isProcessing = true;
    }
  }

  dragOverHandler(ev) {
    ev.stopPropagation();
    ev.preventDefault();
  }

}
