import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
import { PersonData, ServerResponse, Weather } from '../models';


const URL_API_WEATHER = 'http://localhost:8080/api/weather'


@Injectable()
export class WeatherService {

  constructor() { }

  http = inject(HttpClient)
  
  onRequest = new Subject<ServerResponse>()
  onWeatherRequest = new Subject<Weather>()

  //for practice
  getRandom(count:number = 5): Observable<number> {
    const qs = new HttpParams()
        .set('count', count)
    console.info('>>>>>>sending to server...')
    return this.http.get<any>(URL_API_WEATHER, { params: qs })
        .pipe(
          //onRequest is an Observable which is used for logging the RandomResponse
          //resp is the RandomResponse object which has numbers[] and timestamp
          tap(resp => this.onRequest.next(resp)),
          map(resp => resp.number)
        )
    }

    // visibility: number
    // sunrise: string
    // sunset: string
    // mainWeather: string
    // description: string
    getWeather(city:string): Observable<Weather> {

      const qs = new HttpParams()
          .set('city', city)
      console.info('>>>>>>sending to Weather server...')
      return this.http.get<Weather>(URL_API_WEATHER, { params: qs })
          .pipe(
            tap(resp => this.onWeatherRequest.next(resp)),
            map(resp => ({ city: resp.city, temperature: resp.temperature, 
                        visibility: resp.visibility, sunrise: resp.sunrise,
                        sunset: resp.sunset, mainWeather: resp.mainWeather,
                        description: resp.description}))
          )
      }

  postDataAsJson(data: PersonData): Observable<ServerResponse> {
    // Content-Type: application/json
    // Accept: application/json
    console.info('>>>>>> inside postOrderAsJsonClients', data)
    return this.http.post<ServerResponse>(URL_API_WEATHER, data, { headers: { 'Content-Type': 'application/json' } })
        .pipe(
          //onRequest is used for logger service
          //observable
          tap(resp => this.onRequest.next(resp)),
          map(resp => ({ message: resp.message, timestamp: resp.timestamp }))
        )
  }

  postDataAsForm(data: PersonData): Observable<ServerResponse> {
    // Content-Type: application/x-www-form-urlencoded
    // Accept: application/json

    const form = new HttpParams()
        .set("name", data.name)
        .set("address", data.address)
        .set("age", data.age)

    const headers = new HttpHeaders()
        .set("Content-Type", "application/x-www-form-urlencoded")

    return this.http.post<ServerResponse>(
          URL_API_WEATHER, form.toString(), { headers })
        .pipe(
          tap(resp => this.onRequest.next(resp)),
          map(resp => ({ message: resp.message, timestamp: resp.timestamp }))
        )

  }


}
