<template>
  <section class="w-100" style="max-width: 960px">
    <div class="card card-soft p-4 p-md-5 mb-4">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 class="fw-bold mb-1">돈 관리 미니 게임 🎮</h2>
          <p class="text-secondary mb-0">좋은 소비 습관을 고르는 5문제 게임입니다.</p>
        </div>
        <RouterLink to="/dashboard" class="btn btn-outline-secondary rounded-3">대시보드</RouterLink>
      </div>
    </div>

    <div class="card card-soft p-4 p-md-5 mb-4">
      <h3 class="h5 fw-bold mb-3">문제 {{ currentIndex + 1 }} / {{ questions.length }}</h3>
      <p class="fs-5 mb-4">{{ current.question }}</p>
      <div class="vstack gap-2">
        <button
          v-for="choice in current.choices"
          :key="choice.label"
          class="btn btn-outline-primary text-start py-3 rounded-3"
          @click="answer(choice.score)"
          :disabled="finished"
        >
          {{ choice.label }}
        </button>
      </div>
    </div>

    <div v-if="finished" class="card card-soft p-4 p-md-5">
      <h3 class="fw-bold">결과: {{ level }} ({{ score }}점)</h3>
      <p class="text-secondary mb-2">최근 결과를 `db.json`에 저장했습니다.</p>
      <div class="alert alert-info rounded-3 mb-4">
        <strong>금융 개선 제안:</strong> {{ analysis }}
      </div>
      <button class="btn btn-kb rounded-3 px-4" @click="restart">다시하기</button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '@/api.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useAccountBookStore } from '@/stores/accountBookStore.js'

const authStore = useAuthStore()
const accountStore = useAccountBookStore()

const questions = [
  { question: '월급을 받으면 먼저 무엇을 하나요?', choices: [{ label: '저축부터 자동이체한다', score: 20 }, { label: '바로 쇼핑한다', score: 5 }] },
  { question: '예산을 세우는 주기는?', choices: [{ label: '매월 고정적으로 한다', score: 20 }, { label: '필요할 때만 한다', score: 10 }] },
  { question: '비상금은 어느 정도 있나요?', choices: [{ label: '3개월 이상 생활비', score: 20 }, { label: '거의 없다', score: 5 }] },
  { question: '카드 사용 후 점검은?', choices: [{ label: '주 1회 소비 점검', score: 20 }, { label: '연체만 안 나면 신경 안 쓴다', score: 5 }] },
  { question: '투자 전 확인하는 것은?', choices: [{ label: '위험도와 분산 투자', score: 20 }, { label: '수익률만 보고 바로 투자', score: 5 }] }
]

const currentIndex = ref(0)
const score = ref(0)
const finished = ref(false)
const current = computed(() => questions[currentIndex.value])

const level = computed(() => {
  if (score.value >= 90) return 'Gold'
  if (score.value >= 70) return 'Silver'
  return 'Bronze'
})

const analysis = computed(() => {
  const income = accountStore.totalIncome || 1
  const expenseRate = Math.round((accountStore.totalExpense / income) * 100)
  if (score.value >= 90) return '지출 통제가 매우 우수합니다. 투자 비중을 분산하고 목표 수익률을 월 1회 점검하세요.'
  if (score.value >= 70) return `기본 습관은 좋습니다. 현재 지출률은 약 ${expenseRate}%입니다. 고정지출을 10% 줄이면 저축 속도가 더 빨라집니다.`
  return `충동지출 가능성이 높습니다. 현재 지출률은 약 ${expenseRate}%입니다. 50/30/20 예산 규칙과 카드 한도 설정을 먼저 적용하세요.`
})

onMounted(async () => {
  if (accountStore.transactions.length === 0) {
    await accountStore.fetchTransactions()
  }
})

async function answer(nextScore) {
  if (finished.value) return
  score.value += nextScore
  if (currentIndex.value === questions.length - 1) {
    finished.value = true
    await saveResult()
    return
  }
  currentIndex.value += 1
}

async function saveResult() {
  if (!authStore.user) return
  await api.post('/gameResults', {
    userId: authStore.user.id,
    score: score.value,
    level: level.value,
    analysis: analysis.value,
    createdAt: new Date().toISOString()
  })
}

function restart() {
  currentIndex.value = 0
  score.value = 0
  finished.value = false
}
</script>
