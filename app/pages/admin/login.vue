<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <!-- Language Selector - Top Right -->
    <div class="absolute top-4 right-4">
      <LanguageSelector />
    </div>

    <div class="max-w-md w-full space-y-8">
      <UPageCard class="w-full">
        <ClientOnly>
          <UAuthForm
            :schema="schema"
            title="관리자 로그인"
            description="승인 관리 시스템에 로그인하세요"
            icon="i-lucide-shield-check"
            :fields="fields"
            @submit="onSubmit"
          />
        </ClientOnly>
      </UPageCard>

      <div class="text-center">
        <UButton :to="`/${locale}/`" variant="ghost" size="sm"> 홈으로 돌아가기 </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
const { locale } = useI18n()

// 관리자 로그인 페이지는 public이므로 인증 미들웨어 적용하지 않음
definePageMeta({
  layout: false,
})

const { login } = useAdminAuth()
const toast = useToast()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: '이메일',
    placeholder: '관리자 이메일을 입력하세요',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
    required: true,
  },
]

const schema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

type Schema = z.output<typeof schema>

const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  try {
    const success = await login(payload.data.email, payload.data.password)

    if (success) {
      toast.add({
        title: '로그인 성공',
        description: '관리자 대시보드로 이동합니다.',
        color: 'success',
      })

      await navigateTo('/ko/admin/dashboard')
    } else {
      toast.add({
        title: '로그인 실패',
        description: '이메일 또는 비밀번호를 확인해주세요.',
        color: 'error',
      })
    }
  } catch (error) {
    console.error('로그인 오류:', error)
    toast.add({
      title: '로그인 오류',
      description: '로그인 중 오류가 발생했습니다.',
      color: 'error',
    })
  }
}
</script>
