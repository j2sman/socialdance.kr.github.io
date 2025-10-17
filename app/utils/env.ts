// 환경 변수 검증 및 설정 유틸리티

export const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SESSION_SECRET',
] as const

export const optionalEnvVars = [
  'GOOGLE_CALENDAR_API_KEY',
  'KAKAO_MAP_API_KEY',
  'NAVER_MAP_CLIENT_ID',
  'NAVER_MAP_CLIENT_SECRET',
  'GOOGLE_MAPS_API_KEY',
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ACCOUNT_ID',
] as const

export function validateEnvVars() {
  const missing: string[] = []

  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  })

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.'
    )
  }

  console.log('✅ All required environment variables are set')
}

export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue

  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }

  return value
}

export function getOptionalEnvVar(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue
}
