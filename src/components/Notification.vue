<script setup lang="ts">
import type { NotificationData } from '../types'
const props = defineProps<{ data: NotificationData }>()
</script>

<template>
  <div class="notification" :class="data.type">
    {{ data.message }}
  </div>
</template>