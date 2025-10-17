#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const envTemplate = `# Supabase 설정
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
`

const envPath = path.join(process.cwd(), '.env.local')

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local 파일이 이미 존재합니다.')
  console.log('기존 파일을 덮어쓰시겠습니까? (y/N)')

  process.stdin.on('data', data => {
    const input = data.toString().trim().toLowerCase()

    if (input === 'y' || input === 'yes') {
      createEnvFile()
    } else {
      console.log('취소되었습니다.')
      throw new Error('취소되었습니다.')
    }
  })
} else {
  createEnvFile()
}

function createEnvFile() {
  try {
    fs.writeFileSync(envPath, envTemplate)
    console.log('✅ .env.local 파일이 생성되었습니다.')
    console.log('📝 환경 변수 값을 실제 값으로 변경해주세요.')
    console.log('🔗 설정 방법: https://github.com/your-repo#환경-변수-설정')
  } catch (error) {
    console.error('❌ .env.local 파일 생성 실패:', error.message)
    throw new Error('파일 생성 실패')
  }
}
