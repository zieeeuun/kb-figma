<template>
  <section class="w-100 text-center" style="max-width: 980px">
    <div class="mb-5">
      <div class="mx-auto mb-4 d-flex align-items-center justify-content-center bg-primary text-white fw-bold shadow-lg rounded-5" style="width:96px;height:96px;font-size:44px">KB</div>
      <h1 class="display-4 fw-bold mb-3">국민은행 가계부</h1>
      <p class="lead text-secondary mb-4">수입·지출 기록부터 월별 분석까지 한 화면에서 관리하는 Vue3 기반 가계부입니다.</p>
      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <RouterLink to="/login" class="btn btn-kb btn-lg rounded-4 px-5 py-3 shadow">로그인하기</RouterLink>
        <RouterLink to="/signup" class="btn btn-outline-warning btn-lg rounded-4 px-5 py-3 bg-white">회원가입하기</RouterLink>
      </div>
    </div>

    <div class="row g-4 mt-3">
      <div v-for="feature in features" :key="feature.title" class="col-md-4">
        <div class="card card-soft h-100 p-4">
          <div class="fs-1 mb-3">{{ feature.icon }}</div>
          <h3 class="h5 fw-bold">{{ feature.title }}</h3>
          <p class="text-secondary mb-0">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  { icon: '💳', title: '간편한 기록', desc: '수입과 지출을 빠르게 입력하고 즉시 목록에 반영합니다.' },
  { icon: '📊', title: '월별 분석', desc: '이번 달 수입, 지출, 잔액을 Pinia 상태 기반으로 계산합니다.' },
  { icon: '🎨', title: '반응형 UI', desc: 'Tailwind와 Bootstrap 5를 함께 적용한 깔끔한 화면입니다.' }
]
</script>
