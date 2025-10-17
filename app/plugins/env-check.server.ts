// 서버 사이드 환경 변수 검증
export default defineNuxtPlugin(async () => {
  if (import.meta.server) {
    try {
      const { validateEnvVars } = await import('~/utils/env')
      validateEnvVars()
    } catch (error) {
      console.error('❌ Environment validation failed:', error)
      throw error
    }
  }
})
