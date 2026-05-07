import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/api.js'
import { useAuthStore } from '@/stores/authStore.js'

export const useAccountBookStore = defineStore('accountBook', () => {
  const transactions = ref([])
  const accounts = ref([])
  const loading = ref(false)
  const error = ref('')

  const currentMonth = computed(() => new Date().toISOString().slice(0, 7))
  const monthlyTransactions = computed(() =>
    transactions.value.filter((item) => item.date?.startsWith(currentMonth.value))
  )

  const totalIncome = computed(() =>
    monthlyTransactions.value
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + Number(item.amount), 0)
  )

  const totalExpense = computed(() =>
    monthlyTransactions.value
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + Number(item.amount), 0)
  )

  const balance = computed(() => totalIncome.value - totalExpense.value)
  const expenseByCategory = computed(() => makeCategorySummary('expense'))
  const incomeByCategory = computed(() => makeCategorySummary('income'))

  function makeCategorySummary(type) {
    const summary = {}
    monthlyTransactions.value
      .filter((item) => item.type === type)
      .forEach((item) => {
        summary[item.category] = (summary[item.category] || 0) + Number(item.amount)
      })
    return Object.entries(summary)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }

  async function fetchTransactions() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/transactions', {
        params: {
          userId: authStore.user.id,
          _sort: '-date'
        }
      })
      transactions.value = data
    } catch (err) {
      error.value = '입출금 내역을 불러오지 못했습니다.'
    } finally {
      loading.value = false
    }
  }

  async function fetchAccounts() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/accounts', {
        params: {
          userId: authStore.user.id
        }
      })
      accounts.value = data
    } catch (err) {
      error.value = '계좌 목록을 불러오지 못했습니다.'
    } finally {
      loading.value = false
    }
  }

  async function addTransaction(payload) {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('로그인이 필요합니다.')
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.post('/transactions', {
        ...payload,
        userId: authStore.user.id,
        amount: Number(payload.amount),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      transactions.value.unshift(data)
      return data
    } catch (err) {
      error.value = '입출금 내역 추가 중 오류가 발생했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTransaction(id, payload) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.patch(`/transactions/${id}`, {
        ...payload,
        amount: Number(payload.amount),
        updatedAt: new Date().toISOString()
      })
      transactions.value = transactions.value.map((item) => item.id === id ? data : item)
      return data
    } catch (err) {
      error.value = '입출금 내역 수정 중 오류가 발생했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTransaction(id) {
    loading.value = true
    error.value = ''
    try {
      await api.delete(`/transactions/${id}`)
      transactions.value = transactions.value.filter((item) => item.id !== id)
    } catch (err) {
      error.value = '입출금 내역 삭제 중 오류가 발생했습니다.'
    } finally {
      loading.value = false
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(Number(amount || 0)) + '원'
  }

  return {
    transactions,
    accounts,
    loading,
    error,
    monthlyTransactions,
    totalIncome,
    totalExpense,
    balance,
    expenseByCategory,
    incomeByCategory,
    fetchTransactions,
    fetchAccounts,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    formatCurrency
  }
})
