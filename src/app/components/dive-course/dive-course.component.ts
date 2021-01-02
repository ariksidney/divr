import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FirestoreService
} from 'src/app/services/firestore.service';
import {
  AuthService
} from 'src/app/services/auth.service';

import { ActivatedRoute } from '@angular/router';
import { Dive, DiveSite } from 'src/app/services/dive';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EditDiveComponent } from './edit-dive/edit-dive.component';

@Component({
  selector: 'app-dive-course',
  templateUrl: './dive-course.component.html',
  styleUrls: ['./dive-course.component.scss']
})
export class DiveCourseComponent implements OnInit {

  diveId: string;

  data = [];
  greatestDepth: Number;
  duration;
  startTime;
  waterTemp: string[];
  divesite: DiveSite;

  panelOpenState;

  loaded = false;

  constructor(private firestore: FirestoreService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private _bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    this.diveId = this.route.snapshot.paramMap.get('id');
    this.firestore.getDetailedDive(this.auth.uid, this.diveId).subscribe((diveSnapshot: DocumentSnapshot<Dive>) => {
      if (diveSnapshot.exists && diveSnapshot.data) {
        const dive = diveSnapshot.data();
        const waypoints = dive.waypoints;
        this.greatestDepth = dive.details.greatestDepth;
        this.startTime = dive.details.startTime;
        this.duration = this.toDuration(dive.details.duration);
        this.divesite = dive.details.diveSite;
        this.waterTemp = this.waterTemperature(waypoints).map(tempInKelvin => {return this.toCelsius(tempInKelvin)});
        waypoints.forEach(waypoint => {
          this.data.push({
            duration: waypoint.divetime,
            value: waypoint.depth,
            temp: waypoint.temperature - 273.15
          });
        });
      }
      this.loaded = true;
    });
  }

  get details() {
      return [
        { title: 'Max Depth', value: this.greatestDepth.toString() + 'm' },
        { title: 'Duration', value: this.duration },
        { title: 'Start Time', value: new Date(this.startTime.toDate()).toLocaleString()},
        { title: 'Water Temperature', value: `\u{2191} ${this.waterTemp[0]}° \u{2193} ${this.waterTemp[1]}°` }
      ]
  }

  openEditDiveSheet(): void {
    this._bottomSheet.open(EditDiveComponent, { data: { diveSite: this.divesite, id: this.diveId } });
  }

  waterTemperature(waypoints): number[] {
    if (waypoints) {
      const temps = waypoints.map(s => Number(s.temperature));
      const avg = temps.reduce((prev, curr) => prev + curr) / temps.length;
      const max = Math.max(...temps);
      const min = Math.min(...temps);
      return [max, min, avg];
    }
  }

  toCelsius(tempInKelvin): string {
    return (tempInKelvin - 273.15).toFixed(2);
  }

  private toDuration(durationInSeconds: number): String {
    const date = new Date(null);
    date.setSeconds(durationInSeconds);
    return date.toISOString().substr(11, 8);
  }

}
