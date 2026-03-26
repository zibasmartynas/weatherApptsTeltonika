export interface Forecast {
  id?: string
  name: string
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  main: {
    temp: number
    humidity: number
    pressure: number
  }
  wind: {
    speed: number
  }
  weather: {
    icon: string
  }[]
}

export interface NotificationData {
  type: string
  message: string
}