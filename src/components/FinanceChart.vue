<template>
  <div class="row g-4">
    <div class="col-lg-6">
      <div class="card card-soft p-4 h-100">
        <h3 class="h4 fw-bold mb-3">수입/지출 도넛 차트</h3>
        <GChart type="PieChart" :data="incomeExpenseData" :options="pieOptions" />
      </div>
    </div>
    <div class="col-lg-6">
      <div class="card card-soft p-4 h-100">
        <h3 class="h4 fw-bold mb-3">카테고리별 지출</h3>
        <GChart type="BarChart" :data="expenseCategoryData" :options="barOptions" />
      </div>
    </div>
    <div class="col-12">
      <div class="card card-soft p-4">
        <h3 class="h4 fw-bold mb-3">최근 12건 흐름</h3>
        <GChart type="LineChart" :data="trendData" :options="lineOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GChart } from 'vue-google-charts'
import { useAccountBookStore } from '@/stores/accountBookStore.js'

const store = useAccountBookStore()

const incomeExpenseData = computed(() => [
  ['구분', '금액'],
  ['수입', store.totalIncome],
  ['지출', store.totalExpense]
])

const expenseCategoryData = computed(() => {
  const rows = store.expenseByCategory.slice(0, 8).map((item) => [item.category, item.amount])
  return [['카테고리', '금액'], ...rows]
})

const trendData = computed(() => {
  const rows = store.transactions
    .slice(0, 12)
    .reverse()
    .map((item) => [
      item.date,
      item.type === 'income' ? item.amount : 0,
      item.type === 'expense' ? item.amount : 0
    ])
  return [['일자', '수입', '지출'], ...rows]
})

const pieOptions = {
  pieHole: 0.45,
  colors: ['#2563eb', '#f97316'],
  chartArea: { width: '90%', height: '80%' },
  legend: { position: 'bottom' },
  backgroundColor: 'transparent'
}

const barOptions = {
  colors: ['#f59e0b'],
  legend: { position: 'none' },
  chartArea: { width: '70%', height: '75%' },
  backgroundColor: 'transparent',
  hAxis: { format: 'short' }
}

const lineOptions = {
  colors: ['#2563eb', '#f97316'],
  curveType: 'function',
  chartArea: { width: '85%', height: '70%' },
  backgroundColor: 'transparent',
  legend: { position: 'bottom' }
}
</script>
