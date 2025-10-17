# 라틴댄스 소개 플랫폼

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![Bun](https://img.shields.io/badge/Package%20Manager-Bun-000000?logo=bun&labelColor=000000)](https://bun.sh)

전국의 라틴댄스 동호회와 라틴바를 한 곳에서 찾아보고 등록할 수 있는 웹 플랫폼입니다.

## 주요 기능

- 🕺 **동호회 관리**: 라틴댄스 동호회 등록, 검색, 상세 정보 조회
- 🍸 **라틴바 관리**: 라틴바 등록, 검색, 위치 정보 제공
- ✅ **승인 시스템**: 관리자 승인을 통한 품질 관리
- 📱 **반응형 디자인**: 모바일과 데스크톱에서 최적화된 사용자 경험
- 🔗 **소셜 링크**: 인스타그램, 오픈카톡, 유튜브 등 다양한 플랫폼 연동
- 📸 **이미지 업로드**: 동호회/라틴바 소개 사진 관리
- 🗺️ **지도 연동**: 카카오맵, 네이버지도, 구글맵 지원

## 기술 스택

- **Frontend**: Nuxt 4 + Nuxt UI
- **Database**: Supabase
- **Hosting**: Cloudflare Pages + Workers
- **Package Manager**: Bun
- **Language**: TypeScript

## 프로젝트 구조

```
app/
├── components/          # 재사용 가능한 컴포넌트
│   ├── DanceTypeSelector.vue
│   ├── SocialLinkInput.vue
│   └── ImageUploader.vue
├── composables/         # Vue 컴포저블
│   ├── useSiteSettings.ts
│   ├── useAdminAuth.ts
│   ├── useClubs.ts
│   └── useLatinBars.ts
├── layouts/            # 레이아웃
│   └── default.vue
├── pages/              # 페이지
│   ├── index.vue       # 홈페이지
│   ├── clubs/          # 동호회 관련 페이지
│   └── bars/           # 라틴바 관련 페이지
├── types/              # TypeScript 타입 정의
│   └── index.d.ts
└── utils/              # 유틸리티 함수
    └── index.ts

server/
└── api/                # API 엔드포인트
    ├── settings/
    ├── clubs/
    └── bars/
```

## 시작하기

### 1. 의존성 설치

```bash
bun install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Supabase 설정
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Calendar API
GOOGLE_CALENDAR_API_KEY=your-google-calendar-api-key

# 지도 API 키들
KAKAO_MAP_API_KEY=your-kakao-map-api-key
NAVER_MAP_CLIENT_ID=your-naver-map-client-id
NAVER_MAP_CLIENT_SECRET=your-naver-map-client-secret
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Cloudflare 설정
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id

# 세션 보안
SESSION_SECRET=your-session-secret-key-here
```

#### 환경 변수 획득 방법:

**Supabase 설정:**

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. Settings > API에서 URL과 키들 복사

**Google Calendar API:**

1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트 생성
2. Calendar API 활성화
3. API 키 생성

**지도 API:**

- **카카오맵**: [Kakao Developers](https://developers.kakao.com)에서 앱 등록
- **네이버지도**: [Naver Cloud Platform](https://www.ncloud.com)에서 Maps API 신청
- **구글맵**: [Google Cloud Console](https://console.cloud.google.com)에서 Maps API 활성화

**Cloudflare:**

1. [Cloudflare Dashboard](https://dash.cloudflare.com)에서 API 토큰 생성
2. Account ID는 대시보드 우측 사이드바에서 확인

### 3. 데이터베이스 설정

Supabase SQL Editor에서 `supabase-setup.sql` 파일의 내용을 실행하세요:

1. Supabase 대시보드 > SQL Editor로 이동
2. `supabase-setup.sql` 파일의 내용을 복사하여 실행
3. 또는 다음 명령어로 파일 실행:
   ```bash
   # Supabase CLI가 설치된 경우
   supabase db reset
   ```

이 스크립트는 다음을 생성합니다:

- 모든 필요한 테이블
- RLS (Row Level Security) 정책
- 관리자 비밀번호 검증 함수
- 초기 데이터 (관리자 계정, 사이트 설정)

**기본 관리자 계정:**

- 이메일: `admin@latindance.com`
- 비밀번호: `admin123`

### 4. 개발 서버 실행

```bash
bun dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

## 배포

### Cloudflare Pages + Workers

1. Cloudflare Pages에 프로젝트 연결
2. 빌드 설정:
   - Build command: `bun run build`
   - Build output directory: `.output/public`
3. 환경 변수 설정
4. Workers 배포

```bash
# Workers 배포
bun run deploy:worker
```

## 라이선스

MIT License
