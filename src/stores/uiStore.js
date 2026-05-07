import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const THEME_KEY = 'kb-accountbook-theme'

export const useUiStore = defineStore('ui', () => {
  const theme = ref(localStorage.getItem(THEME_KEY) || 'light')

  function applyTheme(nextTheme) {
    theme.value = nextTheme
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem(THEME_KEY, nextTheme)
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  watch(theme, (next) => {
    document.documentElement.setAttribute('data-theme', next)
  }, { immediate: true })

  return {
    theme,
    applyTheme,
    toggleTheme
  }
})
