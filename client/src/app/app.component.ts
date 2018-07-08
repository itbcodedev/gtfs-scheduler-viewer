import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';
import { GTFSService } from './services/gtfs.service';
import { Stop } from './models/stop.model';
import { Observable } from 'rxjs';
import { Agency } from './models/agency.model';
import { Route } from './models/route.model';
import { Trip } from './models/trip.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('gmapRef') mapRef: ElementRef;
  private gmapContainer: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private tripPath: google.maps.Polyline;
  private agencies: Agency[];
  private routes: Route[];
  private selectedRoute: Route;
  private selectedTrip: Trip;
  private trips: Trip[];
  private stops: Stop[];

  constructor(private gtfsService: GTFSService) {}

  async ngOnInit() {
    this.agencies = await this.gtfsService.getAgencies();
  }

  ngAfterViewInit() {
    const options = {
      center: new google.maps.LatLng(36.868446, -116.784582),
      zoom: 8
    };

    this.gmapContainer = new google.maps.Map(
      this.mapRef.nativeElement,
      options
    );
  }

  onAgencyChange(event) {
    const agencyId = event.target.value;
    this.selectedRoute = null;
    this.getRoutes(agencyId);
  }

  onRouteClick(event, route) {
    event.preventDefault();
    this.selectedRoute = route;
    this.getTrips(route.routeId);
  }

  onTripClick(event, trip) {
    event.preventDefault();
    this.selectedTrip = trip;
    this.getStops(trip.tripId);
  }

  private async getRoutes(agencyId: string) {
    const routes = await this.gtfsService.getRoutesByAgency(agencyId);
    this.routes = routes;
  }

  private async getTrips(routeId: string) {
    const trips: Trip[] = await this.gtfsService.getTripByRoute(routeId);
    this.trips = trips;
  }

  private async getStops(tripId: string) {
    const stops: Stop[] = await this.gtfsService.getStopByTrip(tripId);
    this.stops = stops;

    this.importStopToMap(stops);
  }

  private importStopToMap(stops: Stop[]) {
    this.clearMarkers();
    const coordinates = [];

    for (const stop of stops) {
      const position = new google.maps.LatLng(stop.stopLat, stop.stopLon);
      const marker = new google.maps.Marker({
        position,
        label: stop.stopName,
        map: this.gmapContainer
      });

      coordinates.push(position);
      this.markers.push(marker);
    }

    this.tripPath = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    this.tripPath.setMap(this.gmapContainer);
  }

  private clearMarkers() {
    if (this.tripPath) {
      this.tripPath.setMap(null);
    }

    for (const marker of this.markers) {
      marker.setMap(null);
    }
  }
}
