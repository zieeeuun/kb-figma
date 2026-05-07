import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/api.js'

const STORAGE_KEY = 'kb-accountbook-user'

function getRequestErrorMessage(err, fallback) {
  if (err?.code === 'ERR_NETWORK') {
    return 'API 서버에 연결할 수 없습니다. json-server가 실행 중인지 확인해주세요. (https://ai-lovable-1.onrender.com/)'
  }

  return err?.message || fallback
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'))
  const profile = ref(null)
  const loading = ref(false)
  const error = ref('')

  const isLoggedIn = computed(() => !!user.value)
  const userName = computed(() => profile.value?.name || user.value?.name || '사용자')

  function saveUser(nextUser) {
    user.value = nextUser
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }

  async function login(email, password) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/users', { params: { email, password } })
      if (data.length === 0) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
      const loginUser = data[0]
      saveUser({ id: loginUser.id, name: loginUser.name, email: loginUser.email })
      await fetchProfile()
      return true
    } catch (err) {
      error.value = getRequestErrorMessage(err, '로그인 중 오류가 발생했습니다.')
      return false
    } finally {
      loading.value = false
    }
  }

  async function signup(payload) {
    loading.value = true
    error.value = ''
    try {
      const { data: exists } = await api.get('/users', { params: { email: payload.email } })
      if (exists.length > 0) throw new Error('이미 가입된 이메일입니다.')

      const { data: createdUser } = await api.post('/users', {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        createdAt: new Date().toISOString()
      })

      const { data: createdProfile } = await api.post('/profiles', {
        userId: createdUser.id,
        name: payload.name,
        email: payload.email,
        phone: payload.phone || '',
        job: payload.job || '일반 사용자',
        memo: 'json-server와 Pinia Axios 연동 예제 프로필입니다.'
      })

      saveUser({ id: createdUser.id, name: createdUser.name, email: createdUser.email })
      profile.value = createdProfile
      return true
    } catch (err) {
      error.value = getRequestErrorMessage(err, '회원가입 중 오류가 발생했습니다.')
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!user.value) return null
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/profiles', { params: { userId: user.value.id } })
      profile.value = data[0] || null
      return profile.value
    } catch (err) {
      error.value = getRequestErrorMessage(err, '프로필을 불러오지 못했습니다.')
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(payload) {
    if (!profile.value) return false
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.patch(`/profiles/${profile.value.id}`, payload)
      profile.value = data
      if (user.value) saveUser({ ...user.value, name: data.name, email: data.email })
      return true
    } catch (err) {
      error.value = getRequestErrorMessage(err, '프로필 수정 중 오류가 발생했습니다.')
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    profile.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    user,
    profile,
    loading,
    error,
    isLoggedIn,
    userName,
    login,
    signup,
    fetchProfile,
    updateProfile,
    logout
  }
})
