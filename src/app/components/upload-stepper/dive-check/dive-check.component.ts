import { Component, OnInit } from '@angular/core';
import { DiveFileService } from 'src/app/services/dive-file.service';
import { Dive } from 'src/app/services/dive';

@Component({
  selector: 'app-dive-check',
  templateUrl: './dive-check.component.html',
  styleUrls: ['./dive-check.component.scss']
})
export class DiveCheckComponent implements OnInit {

  dives: Dive[] = [];

  constructor(private diveFileService: DiveFileService) { }

  ngOnInit() {
    this.diveFileService.dives.subscribe(dive => this.dives = dive);
  }

  delete(index) {
    this.diveFileService.delete(index);
  }

  private toDuration(durationInSeconds: number): String {
    const date = new Date(null);
    date.setSeconds(durationInSeconds);
    return date.toISOString().substr(11, 8);
  }

}
