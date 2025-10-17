<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">관리자 로그인</h2>
        <p class="mt-2 text-center text-sm text-gray-600">승인 관리 시스템에 로그인하세요</p>
      </div>

      <UCard class="mt-8">
        <UForm :state="form" class="space-y-6" @submit="onSubmit">
          <UFormGroup label="이메일" name="email" required>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="관리자 이메일을 입력하세요"
              required
            />
          </UFormGroup>

          <UFormGroup label="비밀번호" name="password" required>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </UFormGroup>

          <UButton type="submit" :loading="loading" size="lg" color="primary" class="w-full">
            로그인
          </UButton>
        </UForm>
      </UCard>

      <div class="text-center">
        <UButton to="/" variant="ghost" size="sm"> 홈으로 돌아가기 </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 관리자 로그인 페이지는 public이므로 인증 미들웨어 적용하지 않음
definePageMeta({
  layout: false,
})

const { login } = useAdminAuth()
const toast = useToast()

const form = reactive({
  email: '',
  password: '',
})

const loading = ref(false)

const onSubmit = async () => {
  loading.value = true

  try {
    const success = await login(form.email, form.password)

    if (success) {
      toast.add({
        title: '로그인 성공',
        description: '관리자 대시보드로 이동합니다.',
        color: 'green',
      })

      await navigateTo('/admin/dashboard')
    } else {
      toast.add({
        title: '로그인 실패',
        description: '이메일 또는 비밀번호를 확인해주세요.',
        color: 'red',
      })
    }
  } catch (error) {
    console.error('로그인 오류:', error)
    toast.add({
      title: '로그인 오류',
      description: '로그인 중 오류가 발생했습니다.',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>
