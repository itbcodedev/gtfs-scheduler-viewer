import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Stop } from '../models/stop.model';
import { Route } from '../models/route.model';
import { Agency } from '../models/agency.model';
import { Trip } from '../models/trip.model';

const BASE_API_ENDPOINT = '/api/v1';

@Injectable({
  providedIn: 'root'
})
export class GTFSService {
  constructor(private http: HttpClient) {}

  public getAgencies(): Promise<Agency[]> {
    return this.http.get<Agency[]>(`${BASE_API_ENDPOINT}/agencies`).toPromise();
  }

  public getRoutesByAgency(agencyId: string): Promise<Route[]> {
    return this.http
      .get<Route[]>(`${BASE_API_ENDPOINT}/routes/${agencyId}`)
      .toPromise();
  }

  public getTripByRoute(routeId: string): Promise<Trip[]> {
    return this.http
      .get<Trip[]>(`${BASE_API_ENDPOINT}/trips/${routeId}`)
      .toPromise();
  }

  public getStopByTrip(tripId: string): Promise<Stop[]> {
    return this.http
      .get<Stop[]>(`${BASE_API_ENDPOINT}/stops?tripId=${tripId}`)
      .toPromise();
  }
}
