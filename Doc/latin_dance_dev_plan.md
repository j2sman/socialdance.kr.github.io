# 라틴댄스 소개 플랫폼 개발 계획서

## 1. 프로젝트 개요

### 1.1 목적

라틴댄스 동호회와 라틴바 정보를 통합 관리하고 소개하는 웹 플랫폼 구축

### 1.2 기술 스택

- **Frontend**: Nuxt UI 4
- **Database**: Supabase
- **Hosting & CDN**: Cloudflare Pages + Workers
- **Domain Management**: Cloudflare DNS
- **외부 연동**: Google Calendar API, 지도 API (Kakao/Naver/Google Maps)

---

## 2. 기능 요구사항

### 2.1 동호회 소개 기능

#### 필수 항목

- **동호회명**: 텍스트 입력 (필수)

#### 선택 항목

- **라틴댄스 타입**: 다중 선택 (optional)
  - 살사 (Salsa)
  - 바차타 (Bachata)
  - 주크 (Zouk)
  - 차차차 (Cha Cha Cha)
  - 룸바 (Rumba)
  - 삼바 (Samba)
  - 파소도블 (Paso Doble)
  - 자이브 (Jive)
  - 메렝게 (Merengue)
  - 기타
- **수업일정**: Google Calendar 연동 (optional)
- **사이트 주소**: 다중 SNS/커뮤니티 링크
  - 인스타그램
  - 오픈카톡 (비밀번호 포함, 평문 저장)
  - 다음카페
  - 네이버카페
  - 유튜브
  - Notion 공유페이지
  - 기타 URL
- **사진**: 이미지 업로드 (optional, 다중 업로드 지원)

### 2.2 라틴바 소개 기능

#### 필수 항목

- **바명**: 텍스트 입력 (필수)
- **주소**: 지도 연동 (필수)
  - 카카오맵
  - 네이버지도
  - 구글맵

#### 선택 항목

- **사이트 주소**: 동호회와 동일한 SNS/커뮤니티 링크 구조
- **사진**: 이미지 업로드 (optional)

### 2.3 승인 시스템

- **등록**: 누구나 동호회/라틴바 등록 가능
- **수정**: 누구나 동호회/라틴바 수정 요청 가능 (승인 전까지는 이전 정보 표시)
- **상태**:
  - 등록: 대기(pending) → 승인(approved) → 표시
  - 수정: 수정요청(pending_update) → 승인(approved) → 표시
- **승인**: 관리자만 가능
- **표시**: 승인된 항목만 일반 사용자에게 노출
- **수정 중**: 수정 요청이 있는 경우 승인 전까지는 기존 정보 유지 표시

### 2.4 관리자 연락

- **관리자 오픈카톡 링크**: 사이트 전역에서 접근 가능
- **표시 위치**:
  - 헤더/푸터에 "관리자 문의" 버튼
  - 등록 완료 페이지에 "승인 문의하기" 링크
  - 404 또는 문의 필요 시

---

## 3. 데이터베이스 스키마 설계

### 3.1 관리자 테이블 (admins)

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- bcrypt 해시
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 사이트 설정 테이블 (site_settings)

```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 관리자 오픈카톡 링크 초기 데이터
INSERT INTO site_settings (key, value, description)
VALUES (
  'admin_openchat_url',
  'https://open.kakao.com/o/YOUR_CHAT_ID',
  '관리자 오픈카톡 링크'
);

-- RLS 정책: 누구나 조회 가능
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

-- RLS 정책: 관리자만 수정 가능
CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');
```

### 3.3 동호회 테이블 (clubs)

```sql
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  dance_types TEXT[], -- 라틴댄스 타입 배열 (optional, multi-select)
  google_calendar_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  approved_by UUID REFERENCES admins(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS 정책
CREATE POLICY "Public can view approved clubs"
  ON clubs FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can insert clubs"
  ON clubs FOR INSERT
  WITH CHECK (true);
```

### 3.4 라틴바 테이블 (latin_bars)

```sql
CREATE TABLE latin_bars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  map_provider VARCHAR(50), -- 'kakao', 'naver', 'google'
  status VARCHAR(20) DEFAULT 'pending',
  approved_by UUID REFERENCES admins(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS 정책
CREATE POLICY "Public can view approved bars"
  ON latin_bars FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can insert bars"
  ON latin_bars FOR INSERT
  WITH CHECK (true);
```

### 3.5 사이트 링크 테이블 (social_links)

```sql
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL, -- 'club' or 'latin_bar'
  entity_id UUID NOT NULL,
  platform VARCHAR(50) NOT NULL, -- 'instagram', 'kakaotalk', 'notion', etc.
  url TEXT NOT NULL,
  password VARCHAR(255), -- 오픈카톡 비밀번호 (평문 저장)
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.6 사진 테이블 (images)

```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_data BYTEA, -- 이미지 바이너리 데이터 (선택사항)
  file_size INTEGER,
  mime_type VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.7 수정 요청 테이블 (update_requests)

```sql
CREATE TABLE update_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL, -- 'club' or 'latin_bar'
  entity_id UUID NOT NULL, -- 원본 항목 ID
  request_data JSONB NOT NULL, -- 수정 요청 데이터 (전체 정보)
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  requested_by VARCHAR(255), -- 요청자 이메일/연락처 (선택사항)
  approved_by UUID REFERENCES admins(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS 정책
CREATE POLICY "Public can insert update requests"
  ON update_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all update requests"
  ON update_requests FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update update requests"
  ON update_requests FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 4. 주요 페이지 구성

### 4.1 일반 사용자 페이지

- `/` - 메인 페이지
- `/clubs` - 동호회 목록 (승인된 것만)
- `/clubs/[id]` - 동호회 상세
- `/clubs/create` - 동호회 등록 (누구나 가능)
- `/clubs/create/success` - 등록 완료 (관리자 문의 링크 포함)
- `/clubs/[id]/request-update` - 동호회 정보 수정 요청
- `/clubs/[id]/request-update/success` - 수정 요청 완료
- `/bars` - 라틴바 목록 (승인된 것만)
- `/bars/[id]` - 라틴바 상세
- `/bars/create` - 라틴바 등록 (누구나 가능)
- `/bars/create/success` - 등록 완료 (관리자 문의 링크 포함)
- `/bars/[id]/request-update` - 라틴바 정보 수정 요청
- `/bars/[id]/request-update/success` - 수정 요청 완료
- `/search` - 통합 검색
- `/contact` - 관리자 문의 (오픈카톡 링크 안내)

### 4.2 관리자 페이지

- `/admin/login` - 관리자 로그인
- `/admin/dashboard` - 대시보드 (승인 대기 현황)
- `/admin/clubs/pending` - 동호회 승인 대기 목록
- `/admin/bars/pending` - 라틴바 승인 대기 목록
- `/admin/update-requests` - 수정 요청 관리 목록
- `/admin/update-requests/[id]` - 수정 요청 상세 및 승인/거절
- `/admin/clubs` - 전체 동호회 관리
- `/admin/bars` - 전체 라틴바 관리
- `/admin/settings` - 사이트 설정 (오픈카톡 링크 변경)
- `/admin/clubs/[id]/edit` - 동호회 정보 수정
- `/admin/bars/[id]/edit` - 라틴바 정보 수정

---

## 5. UI 구성 - 관리자 연락 기능

### 5.1 헤더 컴포넌트

```vue
<!-- components/AppHeader.vue -->
<template>
  <header>
    <nav>
      <!-- 로고, 메뉴 등 -->
      <UButton
        icon="i-heroicons-chat-bubble-left-right"
        label="관리자 문의"
        color="primary"
        variant="ghost"
        @click="openAdminChat"
      />
    </nav>
  </header>
</template>

<script setup lang="ts">
const { getAdminChatUrl } = useSiteSettings()

const openAdminChat = async () => {
  const url = await getAdminChatUrl()
  window.open(url, '_blank')
}
</script>
```

### 5.2 푸터 컴포넌트

```vue
<!-- components/AppFooter.vue -->
<template>
  <footer>
    <div class="contact-section">
      <h3>문의하기</h3>
      <p>동호회나 라틴바 등록 관련 문의사항이 있으시면 연락주세요.</p>
      <UButton
        icon="i-simple-icons-kakaotalk"
        label="관리자 오픈카톡"
        color="warning"
        @click="openAdminChat"
      />
    </div>
  </footer>
</template>
```

### 5.3 등록 완료 페이지

```vue
<!-- pages/clubs/create/success.vue -->
<template>
  <div class="success-page">
    <UIcon name="i-heroicons-check-circle" class="success-icon" />
    <h1>동호회 등록이 완료되었습니다!</h1>
    <p>관리자 승인 후 사이트에 표시됩니다.</p>

    <UCard class="info-card">
      <p>승인은 보통 1-2일 소요됩니다.</p>
      <p>빠른 승인을 원하시거나 문의사항이 있으시면 관리자에게 연락해주세요.</p>

      <UButton
        icon="i-simple-icons-kakaotalk"
        label="관리자에게 문의하기"
        color="primary"
        size="lg"
        class="mt-4"
        @click="openAdminChat"
      />
    </UCard>

    <div class="actions">
      <UButton to="/clubs" variant="ghost">동호회 목록 보기</UButton>
      <UButton to="/" variant="ghost">홈으로</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getAdminChatUrl } = useSiteSettings()

const openAdminChat = async () => {
  const url = await getAdminChatUrl()
  window.open(url, '_blank')
}
</script>
```

### 5.4 관리자 설정 페이지

```vue
<!-- pages/admin/settings.vue -->
<template>
  <div class="admin-settings">
    <h1>사이트 설정</h1>

    <UCard>
      <template #header>
        <h2>관리자 오픈카톡 링크</h2>
      </template>

      <UForm :state="form" @submit="onSubmit">
        <UFormGroup
          label="오픈카톡 URL"
          name="adminChatUrl"
          help="사용자가 관리자에게 문의할 수 있는 오픈카톡 링크"
        >
          <UInput
            v-model="form.adminChatUrl"
            placeholder="https://open.kakao.com/o/..."
            icon="i-simple-icons-kakaotalk"
          />
        </UFormGroup>

        <UButton type="submit" :loading="loading" class="mt-4"> 저장 </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { updateAdminChatUrl, getAdminChatUrl } = useSiteSettings()

const form = reactive({
  adminChatUrl: '',
})

const loading = ref(false)

onMounted(async () => {
  form.adminChatUrl = await getAdminChatUrl()
})

const onSubmit = async () => {
  loading.value = true
  try {
    await updateAdminChatUrl(form.adminChatUrl)
    // 성공 토스트
  } catch (error) {
    // 에러 토스트
  } finally {
    loading.value = false
  }
}
</script>
```

---

## 6. Composables

### 6.1 사이트 설정 Composable

```typescript
// composables/useSiteSettings.ts
export const useSiteSettings = () => {
  const supabase = useSupabaseClient()

  const getAdminChatUrl = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'admin_openchat_url')
      .single()

    if (error) throw error
    return data.value
  }

  const updateAdminChatUrl = async (url: string) => {
    const { error } = await supabase
      .from('site_settings')
      .update({ value: url, updated_at: new Date().toISOString() })
      .eq('key', 'admin_openchat_url')

    if (error) throw error
  }

  return {
    getAdminChatUrl,
    updateAdminChatUrl,
  }
}
```

---

## 7. Cloudflare Worker 아키텍처

### 7.1 Cloudflare Pages + Workers 설정

#### 7.1.1 도메인 설정

- **도메인**: Cloudflare에서 관리
- **DNS**: Cloudflare DNS 사용
- **SSL**: Cloudflare 자동 SSL 인증서
- **CDN**: Cloudflare 글로벌 CDN 활용

#### 7.1.2 배포 구조

```
Frontend (Nuxt 4) → Cloudflare Pages
API Routes → Cloudflare Workers
Static Assets → Cloudflare Pages (Static)
Database → Supabase (Edge Functions)
```

### 7.2 Cloudflare Worker API 설계

#### 7.2.1 Worker 라우팅 구조

```typescript
// worker/index.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // API 라우팅
    if (path.startsWith('/api/')) {
      return handleApiRequest(request, env)
    }

    // 정적 파일 서빙 (Cloudflare Pages)
    return fetch(request)
  },
}

async function handleApiRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const method = request.method
  const path = url.pathname

  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  // OPTIONS 요청 처리
  if (method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  // API 라우팅
  switch (true) {
    case path.startsWith('/api/settings'):
      return handleSettingsAPI(request, env)
    case path.startsWith('/api/clubs'):
      return handleClubsAPI(request, env)
    case path.startsWith('/api/bars'):
      return handleBarsAPI(request, env)
    case path.startsWith('/api/admin'):
      return handleAdminAPI(request, env)
    case path.startsWith('/api/images'):
      return handleImagesAPI(request, env)
    default:
      return new Response('Not Found', { status: 404, headers: corsHeaders })
  }
}
```

#### 7.2.2 환경 변수 설정

```typescript
// worker/types.ts
export interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  GOOGLE_CALENDAR_API_KEY: string
  KAKAO_MAP_API_KEY: string
  NAVER_MAP_CLIENT_ID: string
  NAVER_MAP_CLIENT_SECRET: string
  GOOGLE_MAPS_API_KEY: string
  SESSION_SECRET: string
}
```

#### 7.2.3 Supabase 연동 Worker

```typescript
// worker/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
}

export function createSupabaseAdminClient(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
}

// RLS 우회를 위한 관리자 클라이언트
export function createSupabaseServiceClient(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
```

#### 7.2.4 이미지 업로드 Worker (Database Storage)

```typescript
// worker/lib/image.ts
export async function uploadImage(
  file: File,
  entityType: string,
  entityId: string,
  env: Env
): Promise<string> {
  const fileName = `${entityType}/${entityId}/${Date.now()}-${file.name}`

  // 파일을 ArrayBuffer로 변환
  const arrayBuffer = await file.arrayBuffer()
  const fileData = new Uint8Array(arrayBuffer)

  // Supabase에 이미지 데이터 저장
  const supabase = createSupabaseServiceClient(env)
  const { data, error } = await supabase
    .from('images')
    .insert({
      entity_type: entityType,
      entity_id: entityId,
      file_name: fileName,
      file_data: fileData,
      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single()

  if (error) throw error

  return `/api/images/${data.id}`
}

export async function deleteImage(imageId: string, env: Env): Promise<void> {
  const supabase = createSupabaseServiceClient(env)
  const { error } = await supabase.from('images').delete().eq('id', imageId)

  if (error) throw error
}

export async function getImage(
  imageId: string,
  env: Env
): Promise<{ data: Uint8Array; mimeType: string } | null> {
  const supabase = createSupabaseServiceClient(env)
  const { data, error } = await supabase
    .from('images')
    .select('file_data, mime_type')
    .eq('id', imageId)
    .single()

  if (error || !data) return null

  return {
    data: data.file_data,
    mimeType: data.mime_type,
  }
}
```

### 7.3 Edge Functions 활용

#### 7.3.1 캐싱 전략

```typescript
// worker/lib/cache.ts
export async function getCachedData(
  key: string,
  env: Env
): Promise<any | null> {
  const cache = caches.default
  const cacheKey = new Request(`https://cache.internal/${key}`)
  const cachedResponse = await cache.match(cacheKey)

  if (cachedResponse) {
    return await cachedResponse.json()
  }
  return null
}

export async function setCachedData(
  key: string,
  data: any,
  ttl: number = 300, // 5분
  env: Env
): Promise<void> {
  const cache = caches.default
  const cacheKey = new Request(`https://cache.internal/${key}`)
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': `max-age=${ttl}`,
      'Content-Type': 'application/json',
    },
  })

  await cache.put(cacheKey, response)
}
```

#### 7.3.2 동호회 목록 캐싱 예시

```typescript
// worker/api/clubs.ts
export async function handleClubsAPI(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url)
  const method = request.method

  if (method === 'GET') {
    // 캐시에서 먼저 확인
    const cacheKey = 'clubs:approved'
    let clubs = await getCachedData(cacheKey, env)

    if (!clubs) {
      // Supabase에서 데이터 조회
      const supabase = createSupabaseClient(env)
      const { data, error } = await supabase
        .from('clubs')
        .select(
          `
          *,
          social_links(*),
          images(*)
        `
        )
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      clubs = data
      // 5분간 캐시
      await setCachedData(cacheKey, clubs, 300, env)
    }

    return new Response(JSON.stringify({ data: clubs }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (method === 'POST') {
    // 동호회 등록 로직
    const body = await request.json()
    const supabase = createSupabaseClient(env)

    const { data, error } = await supabase
      .from('clubs')
      .insert({
        ...body,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 캐시 무효화
    await invalidateCache('clubs:approved', env)

    return new Response(JSON.stringify({ data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response('Method Not Allowed', { status: 405 })
}

// 이미지 API 핸들러
export async function handleImagesAPI(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url)
  const method = request.method
  const path = url.pathname

  if (method === 'GET') {
    // 이미지 ID 추출
    const imageId = path.split('/').pop()
    if (!imageId) {
      return new Response('Image ID required', { status: 400 })
    }

    try {
      const imageData = await getImage(imageId, env)
      if (!imageData) {
        return new Response('Image not found', { status: 404 })
      }

      return new Response(imageData.data, {
        headers: {
          'Content-Type': imageData.mimeType,
          'Cache-Control': 'public, max-age=31536000', // 1년 캐시
        },
      })
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 })
    }
  }

  return new Response('Method Not Allowed', { status: 405 })
}
```

### 7.4 Cloudflare Pages 설정

#### 7.4.1 wrangler.toml 설정

```toml
# wrangler.toml
name = "latin-dance-platform"
main = "worker/index.ts"
compatibility_date = "2024-01-01"

[env.production]
vars = { ENVIRONMENT = "production" }

[env.staging]
vars = { ENVIRONMENT = "staging" }
```

#### 7.4.2 nuxt.config.ts 설정

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      wasm: true,
    },
  },
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NODE_ENV === 'production'
          ? 'https://your-domain.com/api'
          : 'http://localhost:8787/api',
    },
  },
})
```

### 7.5 배포 워크플로우

#### 7.5.1 GitHub Actions 설정

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build Nuxt app
        run: npm run build
        env:
          NUXT_PUBLIC_API_BASE: https://your-domain.com/api

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: latin-dance-platform
          directory: .output/public

      - name: Deploy Worker
        run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 8. API 엔드포인트

### 8.1 일반 사용자 API

```typescript
// 사이트 설정
GET /api/settings/admin-chat - 관리자 오픈카톡 URL 조회

// 동호회
GET /api/clubs - 승인된 동호회 목록
GET /api/clubs/:id - 승인된 동호회 상세
POST /api/clubs - 동호회 등록 (status: pending)
POST /api/clubs/:id/request-update - 동호회 수정 요청

// 라틴바
GET /api/bars - 승인된 라틴바 목록
GET /api/bars/:id - 승인된 라틴바 상세
POST /api/bars - 라틴바 등록 (status: pending)
POST /api/bars/:id/request-update - 라틴바 수정 요청

// 이미지
GET /api/images/:id - 이미지 조회
```

### 8.2 관리자 API

```typescript
// 인증
POST /api/admin/login - 관리자 로그인
POST /api/admin/logout - 로그아웃

// 사이트 설정
PATCH /api/admin/settings/admin-chat - 관리자 오픈카톡 URL 변경

// 승인 관리
GET /api/admin/clubs - 전체 동호회 (상태별 필터)
GET /api/admin/clubs/pending - 승인 대기 동호회
PATCH /api/admin/clubs/:id/approve - 동호회 승인
PATCH /api/admin/clubs/:id/reject - 동호회 거절

GET /api/admin/bars - 전체 라틴바 (상태별 필터)
GET /api/admin/bars/pending - 승인 대기 라틴바
PATCH /api/admin/bars/:id/approve - 라틴바 승인
PATCH /api/admin/bars/:id/reject - 라틴바 거절

// 수정 요청 관리
GET /api/admin/update-requests - 수정 요청 목록
GET /api/admin/update-requests/:id - 수정 요청 상세
PATCH /api/admin/update-requests/:id/approve - 수정 요청 승인 (원본 데이터 업데이트)
PATCH /api/admin/update-requests/:id/reject - 수정 요청 거절

// 정보 수정 (승인 후)
PUT /api/admin/clubs/:id - 동호회 정보 수정 (dance_types 포함)
PUT /api/admin/bars/:id - 라틴바 정보 수정
```

---

## 9. 승인 워크플로우

### 9.1 등록 프로세스

```
1. 사용자 등록 → status: 'pending'
2. 관리자 검토
3. 승인/거절 결정
   - 승인: status → 'approved', approved_by, approved_at 설정
   - 거절: status → 'rejected'
4. 승인된 항목만 일반 사용자에게 표시
```

### 9.2 수정 요청 프로세스

```
1. 사용자가 승인된 항목의 수정 요청 → update_requests 테이블에 저장
2. 기존 항목은 그대로 유지 (사용자에게는 기존 정보 표시)
3. 관리자 검토 (수정 요청 목록에서 확인)
4. 승인/거절 결정
   - 승인: 원본 데이터를 수정 요청 데이터로 업데이트
   - 거절: 수정 요청만 거절 상태로 변경
5. 승인된 수정사항만 사용자에게 반영
```

### 9.3 상태 관리

- **pending**: 승인 대기 (기본값)
- **approved**: 승인 완료 (화면 표시)
- **rejected**: 거절 (표시 안함)
- **pending_update**: 수정 요청 대기 (기존 정보 유지 표시)

---

## 10. 관리자 연락 UX 플로우

### 10.1 사용자 여정

```
1. 동호회/라틴바 등록
   ↓
2. 등록 완료 페이지 표시
   - "관리자 승인 대기 중" 안내
   - "관리자에게 문의하기" 버튼 (오픈카톡)
   ↓
3. 사용자 선택
   A. 기다리기 → 승인 후 이메일/알림 (향후 기능)
   B. 빠른 승인 요청 → 오픈카톡으로 관리자 연락
```

### 10.2 헤더/푸터에서의 접근

```
언제든지 상단 헤더 또는 하단 푸터에서
"관리자 문의" 버튼 클릭 → 오픈카톡 새 창 열림
```

---

## 11. 인증 시스템

### 11.1 관리자 인증

```typescript
// composables/useAdminAuth.ts
export const useAdminAuth = () => {
  const isAdmin = useState('isAdmin', () => false)
  const adminEmail = useState('adminEmail', () => '')

  const login = async (email: string, password: string) => {
    // Supabase RPC로 bcrypt 검증
    const { data, error } = await supabase.rpc('verify_admin', {
      p_email: email,
      p_password: password,
    })

    if (data) {
      isAdmin.value = true
      adminEmail.value = email
      // 세션 저장
    }
  }

  const logout = () => {
    isAdmin.value = false
    adminEmail.value = ''
  }

  return { isAdmin, adminEmail, login, logout }
}
```

### 11.2 Supabase Function (비밀번호 검증)

```sql
-- bcrypt 확장 설치 필요
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION verify_admin(
  p_email VARCHAR,
  p_password VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  v_hash VARCHAR;
BEGIN
  SELECT password INTO v_hash
  FROM admins
  WHERE email = p_email;

  IF v_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN crypt(p_password, v_hash) = v_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 12. 외부 API 연동

### 12.1 Google Calendar API

- **용도**: 동호회 수업 일정 표시
- **필요 작업**:
  - Google Cloud Console에서 Calendar API 활성화
  - OAuth 2.0 인증 설정
  - 공개 캘린더 읽기 권한

### 12.2 지도 API

- **카카오맵 API**
  - 주소 검색 및 좌표 변환
  - 지도 표시 및 마커 설정
- **네이버 지도 API**
  - 동일 기능 제공
- **Google Maps API**
  - 글로벌 지도 서비스

---

## 13. UI/UX 컴포넌트 (Nuxt UI 4)

### 13.1 공통 컴포넌트

- `CardList` - 동호회/라틴바 카드 리스트
- `DetailView` - 상세 정보 표시
- `FormInput` - 입력 폼 (필수/선택 표시)
- `DanceTypeSelector` - 라틴댄스 타입 다중 선택 (체크박스)
- `SocialLinkInput` - SNS 링크 입력 (동적 추가/삭제)
- `ImageUploader` - 이미지 업로드 (드래그앤드롭, 미리보기, 데이터베이스 저장)
- `MapSelector` - 지도 선택 (3가지 지도 제공자 선택)
- `CalendarEmbed` - Google Calendar 임베드

### 13.2 Nuxt UI 활용

- `UButton`, `UInput`, `UTextarea`
- `UCard`, `UContainer`
- `UModal` - 이미지 확대, 지도 상세
- `UBadge` - 필수/선택 표시
- `UTabs` - 지도 제공자 선택

### 13.3 DanceTypeSelector 컴포넌트 예시

```vue
<!-- components/DanceTypeSelector.vue -->
<template>
  <div class="dance-type-selector">
    <h3>라틴댄스 타입 (선택사항)</h3>
    <p class="text-sm text-neutral-600 mb-4">
      해당하는 댄스 타입을 모두 선택해주세요.
    </p>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <UCheckbox
        v-for="danceType in danceTypeOptions"
        :key="danceType.value"
        v-model="selectedTypes"
        :value="danceType.value"
        :label="danceType.label"
        class="flex items-center"
      />
    </div>

    <div v-if="selectedTypes.length > 0" class="mt-4">
      <p class="text-sm text-neutral-600">선택된 댄스 타입:</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <UBadge
          v-for="type in selectedTypes"
          :key="type"
          color="success"
          variant="soft"
        >
          {{ getDanceTypeLabel(type) }}
        </UBadge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const selectedTypes = computed({
  get: () => props.modelValue || [],
  set: value => emit('update:modelValue', value),
})

const danceTypeOptions = [
  { label: '살사 (Salsa)', value: 'salsa' },
  { label: '바차타 (Bachata)', value: 'bachata' },
  { label: '주크 (Zouk)', value: 'zouk' },
  { label: '차차차 (Cha Cha Cha)', value: 'chachacha' },
  { label: '룸바 (Rumba)', value: 'rumba' },
  { label: '삼바 (Samba)', value: 'samba' },
  { label: '파소도블 (Paso Doble)', value: 'pasodoble' },
  { label: '자이브 (Jive)', value: 'jive' },
  { label: '메렝게 (Merengue)', value: 'merengue' },
  { label: '기타', value: 'other' },
]

const getDanceTypeLabel = (value: string) => {
  const option = danceTypeOptions.find(opt => opt.value === value)
  return option ? option.label : value
}
</script>
```

### 13.4 ImageUploader 컴포넌트 예시

```vue
<!-- components/ImageUploader.vue -->
<template>
  <div class="image-uploader">
    <h3>사진 (선택사항)</h3>
    <p class="text-sm text-neutral-600 mb-4">
      동호회/라틴바를 소개할 사진을 업로드해주세요.
    </p>

    <div
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @drop="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
    >
      <UIcon name="i-heroicons-photo" class="upload-icon" />
      <p>파일을 드래그하거나 클릭하여 업로드</p>
      <UButton
        icon="i-heroicons-plus"
        label="파일 선택"
        variant="outline"
        @click="selectFiles"
      />
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
      />
    </div>

    <div v-if="images.length > 0" class="image-preview">
      <div v-for="(image, index) in images" :key="index" class="image-item">
        <img :src="image.preview" :alt="`이미지 ${index + 1}`" />
        <UButton
          icon="i-heroicons-trash"
          color="error"
          variant="ghost"
          size="sm"
          @click="removeImage(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: File[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: File[]]
}>()

const images = ref<File[]>(props.modelValue || [])
const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement>()

const selectFiles = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (files: File[]) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  const newImages = [...images.value, ...imageFiles]

  // 미리보기 URL 생성
  newImages.forEach(file => {
    if (!file.preview) {
      file.preview = URL.createObjectURL(file)
    }
  })

  images.value = newImages
  emit('update:modelValue', images.value)
}

const removeImage = (index: number) => {
  const file = images.value[index]
  if (file.preview) {
    URL.revokeObjectURL(file.preview)
  }

  images.value.splice(index, 1)
  emit('update:modelValue', images.value)
}

// 컴포넌트 언마운트 시 URL 정리
onUnmounted(() => {
  images.value.forEach(file => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
  })
})
</script>

<style scoped>
.upload-area {
  @apply border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center cursor-pointer transition-colors;
}

.upload-area:hover,
.upload-area.drag-over {
  @apply border-success-500 bg-success-50;
}

.upload-icon {
  @apply w-12 h-12 text-neutral-400 mx-auto mb-4;
}

.image-preview {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4 mt-4;
}

.image-item {
  @apply relative group;
}

.image-item img {
  @apply w-full h-32 object-cover rounded-lg;
}

.image-item button {
  @apply absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity;
}
</style>
```

### 13.5 SocialLinkInput 컴포넌트 예시

```vue
<!-- components/SocialLinkInput.vue -->
<template>
  <div class="social-links">
    <h3>사이트 주소</h3>
    <div v-for="(link, index) in links" :key="index" class="link-item">
      <USelect
        v-model="link.platform"
        :options="platformOptions"
        placeholder="플랫폼 선택"
        class="flex-1"
      />
      <UInput v-model="link.url" placeholder="URL 입력" class="flex-2" />
      <UInput
        v-if="link.platform === 'kakaotalk'"
        v-model="link.password"
        placeholder="비밀번호"
        class="flex-1"
      />
      <UButton
        icon="i-heroicons-trash"
        color="error"
        variant="ghost"
        @click="removeLink(index)"
      />
    </div>
    <UButton
      icon="i-heroicons-plus"
      label="링크 추가"
      variant="outline"
      @click="addLink"
    />
  </div>
</template>

<script setup lang="ts">
const platformOptions = [
  { label: '인스타그램', value: 'instagram' },
  { label: '오픈카톡', value: 'kakaotalk' },
  { label: '다음카페', value: 'daumcafe' },
  { label: '네이버카페', value: 'navercafe' },
  { label: '유튜브', value: 'youtube' },
  { label: 'Notion', value: 'notion' },
  { label: '기타', value: 'other' },
]

const links = ref([{ platform: '', url: '', password: '' }])

const addLink = () => {
  links.value.push({ platform: '', url: '', password: '' })
}

const removeLink = (index: number) => {
  links.value.splice(index, 1)
}
</script>
```

### 13.5 동호회 등록 페이지 예시

```vue
<!-- pages/clubs/create.vue -->
<template>
  <div class="create-club-page">
    <h1>동호회 등록</h1>
    <p class="text-neutral-600">
      새로운 동호회를 등록해주세요. 관리자 승인 후 사이트에 표시됩니다.
    </p>

    <UCard>
      <template #header>
        <h2>동호회 정보 입력</h2>
      </template>

      <UForm :state="form" @submit="onSubmit">
        <!-- 기본 정보 -->
        <UFormGroup label="동호회명" name="name" required>
          <UInput v-model="form.name" placeholder="동호회명을 입력해주세요" />
        </UFormGroup>

        <!-- 라틴댄스 타입 선택 -->
        <DanceTypeSelector v-model="form.danceTypes" />

        <!-- Google Calendar 연동 -->
        <UFormGroup label="수업일정 (선택사항)" name="googleCalendarId">
          <UInput
            v-model="form.googleCalendarId"
            placeholder="Google Calendar ID (선택사항)"
            help="Google Calendar 공유 링크에서 ID를 추출하여 입력하세요"
          />
        </UFormGroup>

        <!-- 사이트 링크 -->
        <SocialLinkInput v-model="form.socialLinks" />

        <!-- 사진 관리 -->
        <ImageUploader v-model="form.images" />

        <div class="actions">
          <UButton type="submit" :loading="loading" size="lg">
            동호회 등록
          </UButton>
          <UButton to="/clubs" variant="ghost"> 목록으로 </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  name: '',
  danceTypes: [],
  googleCalendarId: '',
  socialLinks: [],
  images: [],
})

const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  try {
    await $fetch('/api/clubs', {
      method: 'POST',
      body: form,
    })
    await navigateTo('/clubs/create/success')
  } catch (error) {
    // 에러 토스트
    console.error('동호회 등록 실패:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

### 13.6 수정 요청 페이지 예시

```vue
<!-- pages/clubs/[id]/request-update.vue -->
<template>
  <div class="request-update-page">
    <h1>동호회 정보 수정 요청</h1>
    <p class="text-neutral-600">수정 요청은 관리자 승인 후 반영됩니다.</p>

    <UCard>
      <template #header>
        <h2>{{ club.name }} 정보 수정 요청</h2>
      </template>

      <UForm :state="form" @submit="onSubmit">
        <!-- 기본 정보 -->
        <UFormGroup label="동호회명" name="name">
          <UInput v-model="form.name" />
        </UFormGroup>

        <!-- 라틴댄스 타입 선택 -->
        <DanceTypeSelector v-model="form.danceTypes" />

        <!-- 사이트 링크 -->
        <SocialLinkInput v-model="form.socialLinks" />

        <!-- 사진 관리 -->
        <ImageUploader v-model="form.images" />

        <!-- 요청자 정보 (선택사항) -->
        <UFormGroup label="연락처 (선택사항)" name="contact">
          <UInput v-model="form.contact" placeholder="이메일 또는 전화번호" />
        </UFormGroup>

        <div class="actions">
          <UButton type="submit" :loading="loading"> 수정 요청 </UButton>
          <UButton to="/clubs" variant="ghost"> 목록으로 </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const clubId = route.params.id

const form = reactive({
  name: '',
  danceTypes: [],
  socialLinks: [],
  images: [],
  contact: '',
})

const loading = ref(false)

onMounted(async () => {
  // 기존 데이터 로드
  const { data } = await $fetch(`/api/clubs/${clubId}`)
  Object.assign(form, data)
})

const onSubmit = async () => {
  loading.value = true
  try {
    await $fetch(`/api/clubs/${clubId}/request-update`, {
      method: 'POST',
      body: form,
    })
    await navigateTo(`/clubs/${clubId}/request-update/success`)
  } catch (error) {
    // 에러 토스트
  } finally {
    loading.value = false
  }
}
</script>
```

### 13.7 수정 요청 완료 페이지

```vue
<!-- pages/clubs/[id]/request-update/success.vue -->
<template>
  <div class="success-page">
    <UIcon name="i-heroicons-check-circle" class="success-icon" />
    <h1>수정 요청이 완료되었습니다!</h1>
    <p>관리자 승인 후 수정사항이 반영됩니다.</p>

    <UCard class="info-card">
      <p>승인은 보통 1-2일 소요됩니다.</p>
      <p>빠른 승인을 원하시거나 문의사항이 있으시면 관리자에게 연락해주세요.</p>

      <UButton
        icon="i-simple-icons-kakaotalk"
        label="관리자에게 문의하기"
        color="primary"
        size="lg"
        class="mt-4"
        @click="openAdminChat"
      />
    </UCard>

    <div class="actions">
      <UButton :to="`/clubs/${clubId}`" variant="ghost"
        >동호회 상세 보기</UButton
      >
      <UButton to="/clubs" variant="ghost">동호회 목록 보기</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const clubId = route.params.id
const { getAdminChatUrl } = useSiteSettings()

const openAdminChat = async () => {
  const url = await getAdminChatUrl()
  window.open(url, '_blank')
}
</script>
```

### 13.8 관리자 수정 요청 관리 페이지

```vue
<!-- pages/admin/update-requests.vue -->
<template>
  <div class="admin-update-requests">
    <h1>수정 요청 관리</h1>

    <UTabs :items="tabs" v-model="selectedTab">
      <template #pending="{ item }">
        <div class="space-y-4">
          <div
            v-for="request in pendingRequests"
            :key="request.id"
            class="request-card"
          >
            <UCard>
              <template #header>
                <div class="flex justify-between items-center">
                  <h3>{{ getEntityName(request) }}</h3>
                  <UBadge color="warning">{{ request.entity_type }}</UBadge>
                </div>
              </template>

              <div class="space-y-2">
                <p>
                  <strong>요청자:</strong>
                  {{ request.requested_by || '미입력' }}
                </p>
                <p>
                  <strong>요청일:</strong> {{ formatDate(request.created_at) }}
                </p>
                <p><strong>수정 내용:</strong></p>
                <div class="bg-neutral-50 p-3 rounded">
                  <pre class="text-sm">{{
                    JSON.stringify(request.request_data, null, 2)
                  }}</pre>
                </div>
              </div>

              <template #footer>
                <div class="flex gap-2">
                  <UButton
                    color="primary"
                    @click="approveRequest(request.id)"
                    :loading="loading === request.id"
                  >
                    승인
                  </UButton>
                  <UButton
                    color="error"
                    variant="outline"
                    @click="rejectRequest(request.id)"
                    :loading="loading === request.id"
                  >
                    거절
                  </UButton>
                  <UButton
                    variant="ghost"
                    :to="`/admin/update-requests/${request.id}`"
                  >
                    상세보기
                  </UButton>
                </div>
              </template>
            </UCard>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
const tabs = [
  { key: 'pending', label: '승인 대기', count: 0 },
  { key: 'approved', label: '승인됨', count: 0 },
  { key: 'rejected', label: '거절됨', count: 0 },
]

const selectedTab = ref('pending')
const pendingRequests = ref([])
const loading = ref('')

const getEntityName = request => {
  return request.request_data?.name || '이름 없음'
}

const formatDate = date => {
  return new Date(date).toLocaleDateString('ko-KR')
}

const approveRequest = async requestId => {
  loading.value = requestId
  try {
    await $fetch(`/api/admin/update-requests/${requestId}/approve`, {
      method: 'PATCH',
    })
    // 성공 토스트
    await loadRequests()
  } catch (error) {
    // 에러 토스트
  } finally {
    loading.value = ''
  }
}

const rejectRequest = async requestId => {
  loading.value = requestId
  try {
    await $fetch(`/api/admin/update-requests/${requestId}/reject`, {
      method: 'PATCH',
    })
    // 성공 토스트
    await loadRequests()
  } catch (error) {
    // 에러 토스트
  } finally {
    loading.value = ''
  }
}

const loadRequests = async () => {
  const { data } = await $fetch('/api/admin/update-requests')
  pendingRequests.value = data.filter(r => r.status === 'pending')
}

onMounted(() => {
  loadRequests()
})
</script>
```

### 13.9 관리자 수정 페이지 예시

```vue
<!-- pages/admin/clubs/[id]/edit.vue -->
<template>
  <div class="admin-edit-page">
    <h1>동호회 정보 수정</h1>

    <UCard>
      <template #header>
        <h2>{{ club.name }} 정보 수정</h2>
      </template>

      <UForm :state="form" @submit="onSubmit">
        <!-- 기본 정보 -->
        <UFormGroup label="동호회명" name="name">
          <UInput v-model="form.name" />
        </UFormGroup>

        <!-- 라틴댄스 타입 선택 -->
        <DanceTypeSelector v-model="form.danceTypes" />

        <!-- 사이트 링크 -->
        <SocialLinkInput v-model="form.socialLinks" />

        <!-- 사진 관리 -->
        <ImageUploader v-model="form.images" />

        <div class="actions">
          <UButton type="submit" :loading="loading"> 수정 저장 </UButton>
          <UButton to="/admin/clubs" variant="ghost"> 목록으로 </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const clubId = route.params.id

const form = reactive({
  name: '',
  danceTypes: [],
  socialLinks: [],
  images: [],
})

const loading = ref(false)

onMounted(async () => {
  // 기존 데이터 로드
  const { data } = await $fetch(`/api/admin/clubs/${clubId}`)
  Object.assign(form, data)
})

const onSubmit = async () => {
  loading.value = true
  try {
    await $fetch(`/api/admin/clubs/${clubId}`, {
      method: 'PUT',
      body: form,
    })
    // 성공 토스트
    await navigateTo('/admin/clubs')
  } catch (error) {
    // 에러 토스트
  } finally {
    loading.value = false
  }
}
</script>
```

---

## 14. 개발 단계별 계획

### Phase 1: 기본 구조 및 인증 (2주)

- Nuxt 4 프로젝트 초기 설정
- **Cloudflare Pages + Workers 설정**
- **도메인 설정 및 DNS 구성**
- Supabase 연동 및 테이블 생성
- **사이트 설정 테이블 생성 및 관리자 오픈카톡 링크 설정**
- 관리자 인증 시스템 구현
- 기본 레이아웃 및 라우팅

### Phase 2: 동호회 기능 (2주)

- **Cloudflare Worker API 구현**
- 동호회 CRUD 구현
- **등록 완료 페이지 (관리자 문의 링크 포함)**
- **동호회 수정 요청 기능**
- 관리자 승인 시스템
- Google Calendar 연동
- **SNS 링크 및 이미지 업로드 (Static Storage)**
- Notion 공유페이지 링크 지원

### Phase 3: 라틴바 기능 (2주)

- 라틴바 CRUD 구현
- **등록 완료 페이지 (관리자 문의 링크 포함)**
- **라틴바 수정 요청 기능**
- 관리자 승인 시스템
- 지도 API 연동 (3가지)
- 주소 검색 및 좌표 저장
- **Static Storage 이미지 관리**
- Notion 공유페이지 링크 지원

### Phase 4: 관리자 대시보드 및 설정 (1주)

- 승인 대기 현황 대시보드
- **관리자 설정 페이지 (오픈카톡 링크 관리)**
- **수정 요청 관리 시스템**
- **Cloudflare Worker 캐싱 최적화**
- 통계 및 모니터링
- 일괄 승인/거절 기능
- **승인된 동호회/라틴바 정보 수정 기능**

### Phase 5: UI/UX 개선 및 배포 (1주)

- **헤더/푸터에 관리자 문의 버튼 추가**
- 전체 UI/UX 개선
- 반응형 디자인 최적화
- **Cloudflare CDN 성능 최적화**
- **이미지 최적화 및 압축**
- **Edge Functions 성능 튜닝**
- 테스트 및 배포

---

## 15. 환경 변수 설정

```env
# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Calendar
GOOGLE_CALENDAR_API_KEY=your-api-key

# Map APIs
KAKAO_MAP_API_KEY=your-kakao-key
NAVER_MAP_CLIENT_ID=your-naver-id
NAVER_MAP_CLIENT_SECRET=your-naver-secret
GOOGLE_MAPS_API_KEY=your-google-key

# Cloudflare
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id

# Admin Session
SESSION_SECRET=your-session-secret
```

---

## 16. 초기 데이터 설정

### 16.1 관리자 계정 생성

```sql
-- bcrypt로 비밀번호 해시 생성 후 직접 INSERT
-- 예: bcrypt.hash('your-password', 10)

INSERT INTO admins (email, password)
VALUES (
  'admin@latindance.com',
  '$2b$10$YourHashedPasswordHere'
);
```

### 16.2 관리자 오픈카톡 링크 설정

```sql
-- 관리자 오픈카톡 링크 설정
INSERT INTO site_settings (key, value, description)
VALUES (
  'admin_openchat_url',
  'https://open.kakao.com/o/YOUR_CHAT_ID',
  '관리자 오픈카톡 링크'
);
```

### 16.3 비밀번호 해시 생성 방법

```bash
# Node.js에서 bcrypt 사용
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('yourpassword', 10, (err, hash) => console.log(hash));"
```

---

## 17. 보안 고려사항

- ✅ 관리자 비밀번호 bcrypt 해시 저장
- ✅ Supabase RLS로 승인된 항목만 조회 가능
- ✅ 오픈카톡 비밀번호 평문 저장 (공유 목적)
- ✅ 관리자 세션 관리 (JWT 또는 쿠키)
- ✅ 관리자 오픈카톡 링크는 누구나 조회 가능 (공개 정보)
- ✅ 사이트 설정 변경은 관리자만 가능
- ✅ **Cloudflare Worker 환경 변수 보안 관리**
- ✅ **Static Storage 접근 권한 제한**
- ✅ 이미지 업로드 용량 및 형식 제한
- ✅ API 키 노출 방지 (서버 사이드 호출)
- ✅ **CORS 정책 설정**
- ✅ **Rate Limiting 적용**

---

## 18. 향후 확장 가능성

- 등록자에게 승인/거절 이메일 알림
- 승인 거절 사유 입력
- 수정 요청 기능
- 통계 및 리포트 (월별 등록/승인 현황)
- 관리자 권한 레벨 (슈퍼 관리자, 일반 관리자)
- **다수의 관리자별 개별 오픈카톡 링크 (업무 분담)**
- **FAQ 페이지 (자주 묻는 질문)**
- **Cloudflare Analytics 및 모니터링**
- **Edge Functions를 활용한 실시간 알림**
- 지역별 필터링
- 리뷰 및 평점 기능
- 이벤트 등록 및 참가 신청
- **PWA (Progressive Web App) 지원**
- 모바일 앱 개발

---

## 19. 참고 사항

이 개발 계획서는 라틴댄스 동호회와 라틴바를 소개하는 플랫폼을 단계적으로
구현하기 위한 종합 가이드입니다.

**Cloudflare Worker와 Pages를 활용한 서버리스 아키텍처**로 구축하여 높은 성능과
확장성을 제공합니다.

각 Phase별로 진행하며, 필요에 따라 우선순위를 조정할 수 있습니다.

프로젝트 진행 중 추가 요구사항이나 변경사항이 있을 경우 이 문서를 업데이트하여
관리하시기 바랍니다.
