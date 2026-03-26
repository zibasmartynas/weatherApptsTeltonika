<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import WeatherTable from './components/WeatherTable.vue'
import AddForecastModal from './components/AddForecastModal.vue'
import Notification from './components/Notification.vue'
import { loadForecasts, saveForecasts } from './composables/storage'
import { useWeather } from './composables/useWeather'
import type { Forecast, NotificationData } from './types'
import './style.css'

const forecasts = ref<Forecast[]>([])
const search = ref('')
const showModal = ref(false)
const notification = ref<NotificationData | null>(null)
const { fetchWeather } = useWeather()
const logoURL = 'https://www.clipartmax.com/png/middle/237-2372176_weather-app-weather-app-logo.png'

let intervalId: number | undefined
let notificationTimeout: number | undefined

onMounted(() => {
  forecasts.value = loadForecasts().map(f => ({ ...f, id: f.id || crypto.randomUUID?.() }))
  refreshForecasts()
  intervalId = window.setInterval(refreshForecasts, 5*60*1000)
})

onUnmounted(() => { if(intervalId) clearInterval(intervalId) })

const filteredForecasts = computed(() =>
  forecasts.value.filter(f => f.name.toLowerCase().includes(search.value.toLowerCase()))
)

const generateId = (): string =>
  crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`

const addForecast = (forecast: Forecast) => {
  forecasts.value.unshift({ ...forecast, id: generateId() })
  saveForecasts(forecasts.value)
  showNotification({ type: 'is-success', message: 'Forecast added!' })
}

const removeForecast = (id: string) => {
  forecasts.value = forecasts.value.filter(f => f.id !== id)
  saveForecasts(forecasts.value)
  showNotification({ type: 'is-danger', message: 'Forecast removed!' })
}

const refreshForecasts = async (): Promise<void> => {
  if (!forecasts.value.length) return
  const updated: Forecast[] = []
  let hadError = false
  for (const f of forecasts.value) {
    try {
      const { data } = await fetchWeather({ q: `${f.name},${f.sys.country}` })
      if (data) updated.push({ ...data, id: f.id })
      else { updated.push(f); hadError = true }
    } catch {
      updated.push(f)
      hadError = true
    }
  }
  forecasts.value = updated
  console.log("Updated forecasts: ", new Date().toLocaleString())
  saveForecasts(updated)
  showNotification({ type: hadError?'is-warning':'is-info', message: hadError?'Some forecasts failed':'Forecasts updated successfully' })
}

const showNotification = (data: NotificationData) => {
  notification.value = data
  if(notificationTimeout) clearTimeout(notificationTimeout)
  notificationTimeout = window.setTimeout(()=>notification.value=null, 3000)
}
</script>

<template>
  <div class="container mt-5">
    <div class="header is-flex is-align-items-center is-justify-content-center mb-4">
      <figure class="image is-64x64 mr-3"><img class="is-rounded" :src="logoURL" alt="LOGO" /></figure>
      <h1 class="title">Weather App</h1>
    </div>

    <div class="field is-grouped">
      <div class="control is-expanded"><input class="input" v-model="search" placeholder="Search for forecasts" /></div>
      <div class="control"><button class="button is-primary" @click="showModal=true">Add Forecast</button></div>
    </div>

    <div class="notification-wrapper">
    <Notification v-if="notification" :data="notification" />
    </div>

    <WeatherTable :forecasts="filteredForecasts" @remove="removeForecast" />

    <AddForecastModal v-if="showModal" @close="showModal=false" @add="addForecast" @notify="showNotification" />
  </div>
</template>