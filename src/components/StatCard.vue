<template>
  <div class="card card-soft p-4 h-100" :class="toneClass">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h3 class="h6 fw-bold mb-0">{{ title }}</h3>
      <span class="fs-3">{{ icon }}</span>
    </div>
    <p class="display-6 fw-bold mb-0" :class="valueClass">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  icon: String,
  toneClass: { type: String, default: '' },
  valueClass: { type: String, default: 'text-dark' }
})
</script>
