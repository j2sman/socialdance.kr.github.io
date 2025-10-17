export default defineNuxtRouteMiddleware(async to => {
  // 관리자 페이지가 아닌 경우 통과
  if (!to.path.startsWith('/admin')) {
    return
  }

  // 관리자 인증 확인
  const { isAdmin, checkAuth } = useAdminAuth()

  // 클라이언트 사이드에서 인증 상태 확인
  if (process.client) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return navigateTo('/admin/login')
    }
  }

  // 서버 사이드에서 인증 상태 확인
  if (process.server) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return navigateTo('/admin/login')
    }
  }
})
