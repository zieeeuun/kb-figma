<template>
  <div class="card card-soft p-4">
    <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-4">
      <h3 class="h4 fw-bold mb-0">거래 내역</h3>
      <button class="btn btn-outline-primary rounded-3" @click="store.fetchTransactions">새로고침</button>
    </div>

    <div v-if="store.error" class="alert alert-danger rounded-3">{{ store.error }}</div>
    <div v-if="store.loading" class="text-center py-4 text-secondary">처리 중입니다...</div>

    <div v-if="store.transactions.length === 0 && !store.loading" class="text-center py-5">
      <div class="display-1 mb-3">📝</div>
      <p class="text-secondary mb-0">아직 기록된 내역이 없습니다.</p>
    </div>

    <div v-else class="vstack gap-3">
      <div v-for="item in pagedTransactions" :key="item.id" class="border rounded-4 p-3 app-surface">
        <template v-if="editingId === item.id">
          <form @submit.prevent="saveEdit(item.id)" class="row g-3 align-items-end">
            <div class="col-md-2">
              <label class="form-label small fw-semibold">구분</label>
              <select v-model="editForm.type" class="form-select rounded-3">
                <option value="income">수입</option>
                <option value="expense">지출</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">금액</label>
              <input v-model.number="editForm.amount" type="number" min="0" class="form-control rounded-3" required />
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">카테고리</label>
              <input v-model="editForm.category" class="form-control rounded-3" required />
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">날짜</label>
              <input v-model="editForm.date" type="date" class="form-control rounded-3" required />
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">메모</label>
              <input v-model="editForm.description" class="form-control rounded-3" />
            </div>
            <div class="col-md-2 d-flex gap-2">
              <button class="btn btn-kb btn-sm rounded-3 flex-fill">저장</button>
              <button type="button" class="btn btn-outline-secondary btn-sm rounded-3 flex-fill" @click="cancelEdit">취소</button>
            </div>
          </form>
        </template>

        <template v-else>
          <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div>
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge rounded-pill" :class="item.type === 'income' ? 'text-bg-primary' : 'text-bg-warning'">
                  {{ item.type === 'income' ? '수입' : '지출' }}
                </span>
                <strong>{{ item.category }}</strong>
              </div>
              <p v-if="item.description" class="text-secondary mb-1">{{ item.description }}</p>
              <small class="text-muted">{{ formatDate(item.date) }}</small>
            </div>

            <div class="d-flex align-items-center gap-2 flex-wrap">
              <strong class="fs-5 me-2" :class="item.type === 'income' ? 'text-primary' : 'text-warning'">
                {{ item.type === 'income' ? '+' : '-' }}{{ store.formatCurrency(item.amount) }}
              </strong>
              <button class="btn btn-outline-primary btn-sm rounded-3" @click="startEdit(item)">수정</button>
              <button class="btn btn-outline-danger btn-sm rounded-3" @click="remove(item.id)">삭제</button>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-if="totalPages > 1" class="d-flex justify-content-center align-items-center gap-2 mt-4">
      <button class="btn btn-outline-secondary btn-sm rounded-3" :disabled="page === 1" @click="page--">이전</button>
      <span class="small">{{ page }} / {{ totalPages }}</span>
      <button class="btn btn-outline-secondary btn-sm rounded-3" :disabled="page === totalPages" @click="page++">다음</button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useAccountBookStore } from '@/stores/accountBookStore.js'

const store = useAccountBookStore()
const editingId = ref(null)
const page = ref(1)
const pageSize = 8
const editForm = reactive({ type: 'expense', amount: 0, category: '', description: '', date: '' })

const totalPages = computed(() => Math.max(1, Math.ceil(store.transactions.length / pageSize)))
const pagedTransactions = computed(() => {
  const start = (page.value - 1) * pageSize
  return store.transactions.slice(start, start + pageSize)
})

watch(() => store.transactions.length, () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function startEdit(item) {
  editingId.value = item.id
  Object.assign(editForm, {
    type: item.type,
    amount: item.amount,
    category: item.category,
    description: item.description || '',
    date: item.date
  })
}

function cancelEdit() {
  editingId.value = null
}

async function saveEdit(id) {
  await store.updateTransaction(id, { ...editForm })
  editingId.value = null
}

async function remove(id) {
  if (confirm('정말 삭제하시겠습니까?')) await store.deleteTransaction(id)
}
</script>
