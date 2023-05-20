export interface PersonData {
    name: string
    address: string
    age: number

}

export interface ServerResponse {
    message: string
    timestamp: string
}

export interface Weather{
    city: string
    temperature: number
    visibility: number
    sunrise: string
    sunset: string
    mainWeather: string
    description: string
}