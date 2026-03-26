import type { Forecast } from '../types'

export const loadForecasts = (): Forecast[] =>
  JSON.parse(localStorage.getItem('forecasts') || '[]')

export const saveForecasts = (data: Forecast[]): void =>
  localStorage.setItem('forecasts', JSON.stringify(data))
