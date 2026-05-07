<template>
  <section class="w-100" style="max-width: 560px">
    <div class="card card-soft p-4 p-md-5">
      <h2 class="fw-bold text-center mb-2">회원가입</h2>
      <p class="text-secondary text-center mb-4">db.json의 users와 profiles에 새 데이터를 저장합니다.</p>

      <div v-if="authStore.error" class="alert alert-danger rounded-3">{{ authStore.error }}</div>

      <form @submit.prevent="signup" class="vstack gap-3">
        <div>
          <label class="form-label fw-semibold">이름</label>
          <input v-model="form.name" class="form-control form-control-lg rounded-3" placeholder="홍길동" required />
        </div>
        <div>
          <label class="form-label fw-semibold">이메일</label>
          <input v-model="form.email" type="email" class="form-control form-control-lg rounded-3" placeholder="user@example.com" required />
        </div>
        <div>
          <label class="form-label fw-semibold">비밀번호</label>
          <input v-model="form.password" type="password" class="form-control form-control-lg rounded-3" placeholder="4자 이상" minlength="4" required />
        </div>
        <div>
          <label class="form-label fw-semibold">전화번호</label>
          <input v-model="form.phone" class="form-control form-control-lg rounded-3" placeholder="010-0000-0000" />
        </div>
        <button class="btn btn-kb btn-lg rounded-3 mt-2" :disabled="authStore.loading">
          {{ authStore.loading ? '가입 중...' : '가입하고 시작하기' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useAccountBookStore } from '@/stores/accountBookStore.js'

const router = useRouter()
const authStore = useAuthStore()
const accountBookStore = useAccountBookStore()
const form = reactive({ name: '', email: '', password: '', phone: '' })

async function signup() {
  const ok = await authStore.signup(form)
  if (ok) {
    await accountBookStore.fetchTransactions()
    router.push('/dashboard')
  }
}
</script>
