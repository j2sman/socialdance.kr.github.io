export const useAdminAuth = () => {
  // hydration 문제 방지를 위해 초기값을 명시적으로 설정
  const isAdmin = useState('isAdmin', () => false)
  const adminEmail = useState('adminEmail', () => '')

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Supabase RPC로 bcrypt 검증
      const { data, error } = await $fetch<{ data: boolean; error: string }>('/api/admin/login', {
        body: { email, password },
        method: 'POST',
      })

      if (error) {
        throw new Error(error)
      }

      if (data) {
        isAdmin.value = true
        adminEmail.value = email
        return true
      }
      return false
    } catch (error) {
      console.error('로그인 실패:', error)
      return false
    }
  }

  const logout = (): void => {
    isAdmin.value = false
    adminEmail.value = ''
  }

  const checkAuth = async (): Promise<boolean> => {
    try {
      const { data } = await $fetch('/api/admin/check-auth')
      if (data?.isAdmin) {
        isAdmin.value = true
        adminEmail.value = data.email
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  return {
    adminEmail: readonly(adminEmail),
    checkAuth,
    isAdmin: readonly(isAdmin),
    login,
    logout,
  }
}
