<template>
  <section class="w-100" style="max-width: 760px">
    <div class="card card-soft p-4 p-md-5">
      <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
        <div>
          <h2 class="fw-bold mb-1">프로필 보기</h2>
          <p class="text-secondary mb-0">json-server의 profiles 데이터를 조회하고 수정합니다.</p>
        </div>
        <RouterLink to="/dashboard" class="btn btn-outline-secondary rounded-3">대시보드</RouterLink>
      </div>

      <div v-if="authStore.error" class="alert alert-danger rounded-3">{{ authStore.error }}</div>
      <div v-if="saved" class="alert alert-success rounded-3">프로필이 저장되었습니다.</div>

      <form v-if="form" @submit.prevent="save" class="vstack gap-3">
        <div class="d-flex align-items-center gap-3 p-3 rounded-4 app-surface border">
          <img :src="avatarSrc" alt="기본 프로필 이미지" class="rounded-circle border" style="width:78px;height:78px;object-fit:cover" />
          <div>
            <div class="fw-bold">기본 프로필 이미지</div>
            <small class="text-secondary">게임 레벨: <strong>{{ gameLevel }}</strong></small>
          </div>
        </div>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-semibold">이름</label>
            <input v-model="form.name" class="form-control form-control-lg rounded-3" required />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold">이메일</label>
            <input v-model="form.email" type="email" class="form-control form-control-lg rounded-3" required />
          </div>
        </div>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-semibold">전화번호</label>
            <input v-model="form.phone" class="form-control form-control-lg rounded-3" />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold">직업/구분</label>
            <input v-model="form.job" class="form-control form-control-lg rounded-3" />
          </div>
        </div>
        <div>
          <label class="form-label fw-semibold">메모</label>
          <textarea v-model="form.memo" rows="4" class="form-control rounded-3"></textarea>
        </div>
        <button class="btn btn-kb btn-lg rounded-3" :disabled="authStore.loading">
          {{ authStore.loading ? '저장 중...' : '프로필 저장' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { api } from '@/api.js'

const authStore = useAuthStore()
const form = ref(null)
const saved = ref(false)
const gameLevel = ref('Bronze')
const avatarSrc = 'https://api.dicebear.com/9.x/initials/svg?seed=USER&backgroundColor=fee2e2'

onMounted(async () => {
  const profile = await authStore.fetchProfile()
  if (profile) form.value = reactive({ ...profile })
  await fetchGameLevel()
})

async function fetchGameLevel() {
  if (!authStore.user) return
  const { data } = await api.get('/gameResults', {
    params: { userId: authStore.user.id, _sort: 'createdAt', _order: 'desc', _limit: 1 }
  })
  gameLevel.value = data[0]?.level || 'Bronze'
}

async function save() {
  saved.value = false
  const ok = await authStore.updateProfile(form.value)
  if (ok) saved.value = true
}
</script>
