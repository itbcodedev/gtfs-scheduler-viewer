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
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('gmapRef') mapRef: ElementRef;
  private gmapContainer: google.maps.Map;
  private agencies: Agency[];
  private routes: Route[];

  constructor(private gtfsService: GTFSService) {}

  async ngOnInit() {
    this.agencies = await this.gtfsService.getAgencies();
  }

  ngAfterViewInit() {
    const options = {
      center: new google.maps.LatLng(36.868446, -116.784582),
      zoom: 16
    };

    this.gmapContainer = new google.maps.Map(
      this.mapRef.nativeElement,
      options
    );

    // this.gtfsService
    //   .getStops()
    //   .subscribe((response: Stop[]) => this.importStopToMap(response));
  }

  onAgencyChange(event) {
    const agencyId = event.target.value;
    this.getRoutes(agencyId);
  }

  onRouteClick(event, route) {
    event.preventDefault();

    console.log(route);
  }

  private async getRoutes(agencyId: string) {
    const routes = await this.gtfsService.getRoutesByAgency(agencyId);
    this.routes = routes;
  }

  private importStopToMap(stops: Stop[]) {
    for (const stop of stops) {
      const position = new google.maps.LatLng(stop.stopLat, stop.stopLon);
      const marker = new google.maps.Marker({
        position,
        label: stop.stopName,
        map: this.gmapContainer
      });
    }
  }
}
