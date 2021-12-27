import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dive-details',
  templateUrl: './dive-details.component.html',
  styleUrls: ['./dive-details.component.scss']
})
export class DiveDetailsComponent {

  @Input()
  details: {title: string, value: string}[];

}
