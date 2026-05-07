<template>
  <section class="w-100" style="max-width: 480px">
    <div class="card card-soft p-4 p-md-5">
      <h2 class="fw-bold text-center mb-2">로그인</h2>
      <p class="text-secondary text-center mb-4">db.json의 users 데이터로 로그인합니다.</p>

      <div v-if="authStore.error" class="alert alert-danger rounded-3">{{ authStore.error }}</div>

      <form @submit.prevent="login" class="vstack gap-3">
        <div>
          <label class="form-label fw-semibold">이메일</label>
          <input v-model="email" type="email" class="form-control form-control-lg rounded-3" placeholder="kb@example.com" required />
        </div>
        <div>
          <label class="form-label fw-semibold">비밀번호</label>
          <input v-model="password" type="password" class="form-control form-control-lg rounded-3" placeholder="1234" required />
        </div>
        <button class="btn btn-kb btn-lg rounded-3 mt-2" :disabled="authStore.loading">
          {{ authStore.loading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <div class="bg-light rounded-4 p-3 mt-4 small text-secondary">
        테스트 계정: <strong>kb@example.com</strong> / <strong>1234</strong>
      </div>
      <p class="text-center text-secondary mt-4 mb-0">계정이 없나요? <RouterLink to="/signup" class="text-primary fw-bold">회원가입</RouterLink></p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useAccountBookStore } from '@/stores/accountBookStore.js'

const router = useRouter()
const authStore = useAuthStore()
const accountBookStore = useAccountBookStore()
const email = ref('kb@example.com')
const password = ref('1234')

async function login() {
  const ok = await authStore.login(email.value, password.value)
  if (ok) {
    await accountBookStore.fetchTransactions()
    router.push('/dashboard')
  }
}
</script>
