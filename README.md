# KB Account Book - Vue3 + json-server 연동 버전

Vue3 Composition API, ECMAScript Module JavaScript, Pinia, Vue Router, Tailwind CSS, Bootstrap 5를 사용한 가계부 예제입니다.
이번 버전은 `json-server`의 `db.json`을 백엔드처럼 사용하도록 수정했습니다.

## 구현된 기능

- 회원가입: `POST /users`, `POST /profiles`
- 로그인: `GET /users?email=...&password=...`
- 프로필 보기/수정: `GET /profiles?userId=...`, `PATCH /profiles/:id`
- 입출금 내역 CRUD
  - 목록 조회: `GET /transactions?userId=...`
  - 추가: `POST /transactions`
  - 수정: `PATCH /transactions/:id`
  - 삭제: `DELETE /transactions/:id`
- 로그인 상태는 `localStorage`에 저장
- 라우터 가드로 `/dashboard`, `/profile` 보호

## 실행 방법

```bash
npm install
npm run dev:all
```

각 서버를 따로 실행할 수도 있습니다.

```bash
npm run server
npm run dev
```

## 접속 주소

- Vue 개발 서버: `http://localhost:5173`
- json-server API: `http://localhost:3001`

## 테스트 계정

```text
이메일: kb@example.com
비밀번호: 1234
```

## 주요 파일

```text
db.json                         json-server용 DB
src/api.js                      Axios 공통 인스턴스
src/stores/authStore.js         회원가입/로그인/프로필 Pinia Store
src/stores/accountBookStore.js  입출금 내역 CRUD Pinia Store
src/router/index.js             Router + 로그인 가드
src/views/Login.vue             로그인 화면
src/views/Signup.vue            회원가입 화면
src/views/Profile.vue           프로필 보기/수정 화면
src/views/Dashboard.vue         가계부 대시보드
src/components/TransactionForm.vue 입출금 추가
src/components/TransactionList.vue 입출금 조회/수정/삭제
```
