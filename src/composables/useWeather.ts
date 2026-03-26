import axios from 'axios'
import type { Forecast } from '../types'

const API_KEY = 'c550eef6ebd088b812122c825fe952ed'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export function useWeather() {
  const fetchWeather = async (query: any): Promise<{ data: Forecast | null, error: any }> => {
    try {
      const res = await axios.get(BASE_URL, {
        params: { ...query, appid: API_KEY, units: 'metric' }
      })
      return { data: res.data, error: null }
    } catch (error) {
      console.error(error)
      return { data: null, error }
    }
  }

  return { fetchWeather }
}