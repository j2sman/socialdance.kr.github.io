const { locale } = useI18n()

export default defineNuxtRouteMiddleware(async to => {
  // 관리자 페이지가 아닌 경우 통과
  if (!to.path.includes('/admin')) {
    return
  }

  // 관리자 인증 확인
  const { isAdmin, checkAuth } = useAdminAuth()

  // 클라이언트 사이드에서 인증 상태 확인
  if (import.meta.client) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return navigateTo(`/${locale.value}/admin/login`)
    }
  }

  // 서버 사이드에서 인증 상태 확인
  if (import.meta.server) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return navigateTo(`/${locale.value}/admin/login`)
    }
  }
})
