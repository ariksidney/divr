import { Component, Input, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { DiveSite } from 'src/app/services/dive';

@Component({
  selector: 'app-dive-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {


  @Input()
  dives: [];

  @Input()
  diveKeys: [];

  @Input()
  offset: number;

  constructor(private router: Router) { }

  getLocation(diveSite: DiveSite) {
    if (diveSite && diveSite.country && diveSite.location && diveSite.name) {
      return diveSite.country + ' - ' + diveSite.location + ' - ' + diveSite.name;
    } else if (diveSite && diveSite.country && diveSite.location) {
      return diveSite.country + ' - ' + diveSite.location;
    } else if (diveSite && diveSite.country) {
      return diveSite.country;
    }
    return '-';
  }

  toCourse(event, item: string) {
    this.router.navigate(['/course', item]);
  }
}
