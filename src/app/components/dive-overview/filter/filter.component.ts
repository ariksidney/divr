import { Component,  Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Filter } from './filter';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {

  country = '';
  toDate: Date;
  fromDate: Date;

  @Output()
  filter: EventEmitter<Filter> = new EventEmitter<Filter>();

  filterForm = new FormGroup({
    country: new FormControl(''),
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
  });

  constructor(private router: Router) { }

  onFilter(): void {
    const filterObj = this.filterForm.value;

    this.router.navigate(['/'], { queryParams: filterObj });
    this.filter.emit(filterObj);
  }

  onReset(): void {
    this.filterForm.reset;
    this.router.navigate(['/'], { queryParams: {} });
    this.filter.emit(null)
  }

}
