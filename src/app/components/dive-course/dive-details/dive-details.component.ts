import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dive-details',
  templateUrl: './dive-details.component.html',
  styleUrls: ['./dive-details.component.scss']
})
export class DiveDetailsComponent implements OnInit {

  @Input()
  details: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
