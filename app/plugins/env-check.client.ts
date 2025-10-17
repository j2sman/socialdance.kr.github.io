// 클라이언트 사이드 환경 변수 검증
export default defineNuxtPlugin(() => {
  // 클라이언트에서는 공개 환경 변수만 검증
  const config = useRuntimeConfig()

  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) {
    console.error('❌ Missing Supabase configuration')
    console.error('Please check your environment variables')
  } else {
    console.log('✅ Supabase configuration loaded')
  }
})
