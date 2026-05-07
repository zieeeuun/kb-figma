<template>
  <header class="app-surface shadow-sm border-bottom">
    <nav class="container navbar navbar-expand-lg py-3">
      <RouterLink to="/" class="navbar-brand d-flex align-items-center gap-3">
        <span class="d-inline-flex align-items-center justify-content-center bg-primary text-white fw-bold rounded-3" style="width:44px;height:44px">KB</span>
        <span>
          <span class="d-block fw-bold text-dark">국민은행</span>
          <small class="text-secondary">Vue3 + json-server 가계부</small>
        </span>
      </RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="mainNav" class="collapse navbar-collapse justify-content-end">
        <ul class="navbar-nav align-items-lg-center gap-lg-2">
          <li class="nav-item"><RouterLink to="/" class="nav-link">홈</RouterLink></li>
          <template v-if="authStore.isLoggedIn">
            <li class="nav-item"><RouterLink to="/dashboard" class="nav-link">대시보드</RouterLink></li>
            <li class="nav-item">
              <RouterLink to="/profile" class="nav-link d-flex align-items-center gap-2">
                <img :src="avatarSrc" alt="기본 프로필" class="rounded-circle border" style="width:30px;height:30px;object-fit:cover" />
                {{ authStore.userName }}
              </RouterLink>
            </li>
            <li class="nav-item"><RouterLink to="/game" class="nav-link">게임</RouterLink></li>
            <li class="nav-item">
              <button class="btn btn-outline-secondary rounded-3 px-3" @click="uiStore.toggleTheme">
                {{ uiStore.theme === 'dark' ? '☀️ 라이트' : '🌙 다크' }}
              </button>
            </li>
            <li class="nav-item"><button class="btn btn-outline-secondary rounded-3 px-4" @click="logout">로그아웃</button></li>
          </template>
          <template v-else>
            <li class="nav-item"><RouterLink to="/login" class="nav-link">로그인</RouterLink></li>
            <li class="nav-item"><RouterLink to="/signup" class="btn btn-kb rounded-3 px-4">회원가입</RouterLink></li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useAccountBookStore } from '@/stores/accountBookStore.js'
import { useUiStore } from '@/stores/uiStore.js'

const router = useRouter()
const authStore = useAuthStore()
const accountBookStore = useAccountBookStore()
const uiStore = useUiStore()
const avatarSrc = 'https://api.dicebear.com/9.x/initials/svg?seed=KB&backgroundColor=dbeafe'

function logout() {
  authStore.logout()
  accountBookStore.transactions = []
  router.push('/login')
}
</script>
