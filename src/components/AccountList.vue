<template>
  <div class="card card-soft p-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="h4 fw-bold mb-0">계좌 목록</h3>
      <span class="badge text-bg-primary">총 {{ store.accounts.length }}개</span>
    </div>

    <div v-if="store.accounts.length === 0" class="text-secondary py-4 text-center">등록된 계좌가 없습니다.</div>
    <div v-else class="vstack gap-3">
      <div v-for="account in pagedAccounts" :key="account.id" class="p-3 rounded-4 border app-surface">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-semibold">{{ account.bankName }} {{ account.name }}</div>
            <small class="text-secondary">{{ account.number }}</small>
          </div>
          <div class="fw-bold text-primary">{{ store.formatCurrency(account.balance) }}</div>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="d-flex justify-content-center gap-2 mt-4">
      <button class="btn btn-outline-secondary btn-sm" :disabled="page === 1" @click="page--">이전</button>
      <span class="align-self-center small">{{ page }} / {{ totalPages }}</span>
      <button class="btn btn-outline-secondary btn-sm" :disabled="page === totalPages" @click="page++">다음</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAccountBookStore } from '@/stores/accountBookStore.js'

const store = useAccountBookStore()
const page = ref(1)
const pageSize = 4

const totalPages = computed(() => Math.max(1, Math.ceil(store.accounts.length / pageSize)))
const pagedAccounts = computed(() => {
  const start = (page.value - 1) * pageSize
  return store.accounts.slice(start, start + pageSize)
})
</script>
