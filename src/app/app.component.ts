import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherService } from './service/weather.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonData, ServerResponse, Weather } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'open-weather';

  fb = inject(FormBuilder)
  weatherSvc = inject(WeatherService)

  randNum$!: Observable<number>
  weather$!: Observable<Weather>
  mainform!: FormGroup
  weatherform!: FormGroup

  serverResponse$!:Observable<ServerResponse>

  ngOnInit(): void {
    this.mainform = this.createForm(),
    this.weatherform = this.createWeatherForm()
  }

  getRandom() {
    this.randNum$ = this.weatherSvc.getRandom(5)
  }

  getWeather() {
    //get form control field
    const cityControl = this.weatherform.get('city');
    if (cityControl) {
      //get field value
      const cityName: string = cityControl.value;
      console.info('>> city: ', cityName);
      this.weather$ = this.weatherSvc.getWeather(cityName);
    }
  }

  postWithJson() {
    //PersonData is the form fields (name, address, age)
    const data: PersonData = this.mainform.value
    console.info('>> data: ', data)
    this.serverResponse$ = this.weatherSvc.postDataAsJson(data)
  }

  postWithForm() {
    const data: PersonData = this.mainform.value
    console.info('>> data: ', data)
    this.serverResponse$ = this.weatherSvc.postDataAsForm(data)
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: this.fb.control<string>('', [ Validators.required, Validators.minLength(5) ]),
      address: this.fb.control<string>('', [ Validators.required, Validators.minLength(5) ]),
      age: this.fb.control<number>(0, [ Validators.required, Validators.min(0) ]),
    })
  }

  private createWeatherForm(): FormGroup {
    return this.fb.group({
      city: this.fb.control<string>('', [ Validators.required ])
    })
  }
}
