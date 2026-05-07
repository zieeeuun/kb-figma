<template>
  <div class="card card-soft p-5 shadow-sm">
    <h3 class="h3 fw-bold mb-4">내역 추가 ✍️</h3>
    <form @submit.prevent="submit" class="vstack gap-4">
      <div class="btn-group" role="group">
        <button type="button" class="btn py-3 fs-5 fw-bold" :class="form.type === 'income' ? 'btn-primary' : 'btn-outline-secondary'" @click="setType('income')">수입 💰</button>
        <button type="button" class="btn py-3 fs-5 fw-bold" :class="form.type === 'expense' ? 'btn-warning text-white' : 'btn-outline-secondary'" @click="setType('expense')">지출 💸</button>
      </div>

      <div>
        <label class="form-label fw-semibold">금액</label>
        <input v-model.number="form.amount" type="number" min="0" class="form-control form-control-lg rounded-3" placeholder="0" required />
      </div>

      <div>
        <label class="form-label fw-semibold">카테고리</label>
        <select v-model="form.category" class="form-select form-select-lg rounded-3" required>
          <option value="">선택하세요</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>

      <div>
        <label class="form-label fw-semibold">날짜</label>
        <input v-model="form.date" type="date" class="form-control form-control-lg rounded-3" required />
      </div>

      <div>
        <label class="form-label fw-semibold">메모</label>
        <textarea v-model="form.description" class="form-control form-control-lg rounded-3" rows="3" placeholder="간단한 메모를 남겨보세요 😊"></textarea>
      </div>

      <button class="btn btn-kb btn-lg rounded-3 py-3 mt-2 fs-5">추가하기 🚀</button>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useAccountBookStore } from '@/stores/accountBookStore.js'

const emit = defineEmits(['saved'])
const store = useAccountBookStore()
const incomeCategories = ['급여 💼', '보너스 🎉', '사업소득 🧑‍💻', '용돈 💝', '투자수익 📈', '기타수입 🌟']
const expenseCategories = ['식비 🍜', '교통비 🚌', '쇼핑 🛍️', '공과금 💡', '의료비 🏥', '문화생활 🎬', '카페 ☕', '여행 ✈️', '기타지출 📦']

const form = reactive({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
})

const categories = computed(() => form.type === 'income' ? incomeCategories : expenseCategories)

function setType(type) {
  form.type = type
  form.category = ''
}

async function submit() {
  if (!form.amount || !form.category) {
    alert('금액과 카테고리를 입력해주세요.')
    return
  }
  await store.addTransaction({ ...form })
  form.amount = ''
  form.category = ''
  form.description = ''
  form.date = new Date().toISOString().split('T')[0]
  emit('saved')
}
</script>
