import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input()
  latitude: number;

  @Input()
  longitude: number;

  @Input()
  location: string;

  center: google.maps.LatLngLiteral;

  options: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false
  };

  apiLoaded: Observable<boolean>;

  constructor(httpClient: HttpClient) { 
    this.apiLoaded = httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.mapKey}`, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }

  ngOnInit() {
    this.center = {lat: this.latitude, lng: this.longitude};
  }

}
