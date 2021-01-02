import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Filter } from '../dive-overview/filter/filter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loadedDives;
  dives: any[] = [];
  diveKeys: any[] = [];
  noOfDives: number;
  loaded = false;
  offset: number;
  filter: Filter;
  showPagination = true;

  isMobile = false;
  cols = 4;

  pageSize = 20;

  constructor(private firestore: FirestoreService,
    private auth: AuthService,
    private router: Router,
    breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      if (result.matches) {
        this.cols = 1;
      } else {
        this.cols = 4;
      }
    });
  }

  ngOnInit() {
    this.loadPaginatedDives(this.loadedDives, true, undefined)

    this.offset = 1;
    this.showPagination = true;

  }

  toCourse(event, item: string) {
    this.router.navigate(['/course', item]);
  }

  onFilter(event: Filter) {
    if (event) {
      this.showPagination = false;
      this.filter = event;
      this.loadPaginatedDives(null, false, event);
    } else {
      this.loadedDives = undefined
      this.ngOnInit();
    }
  }

  pageChange($event: PageEvent) {
    this.offset = ($event.pageIndex * $event.pageSize) + 1
    this.pageSize = $event.pageSize;
    const toNextPage = ($event.pageIndex >= $event.previousPageIndex);
    this.loadPaginatedDives(this.loadedDives, toNextPage, this.filter);

  }

  loadPaginatedDives(dives, toNextPage: boolean, filter: Filter) {
    this.firestore.getDives(this.auth.uid, dives, this.pageSize, toNextPage, filter).subscribe(dives => {
      if (dives.docs.length) {
        this.loadedDives = dives.docs
        this.dives = [];
        this.diveKeys = [];
        dives.forEach(dive => {
          this.dives.push(dive.data());
          this.diveKeys.push(dive.id);
        });
        this.firestore.getStats(this.auth.uid).subscribe(diveNo => this.noOfDives = diveNo['diveCount']);
      }
      this.loaded = true;
    });
  }

}
