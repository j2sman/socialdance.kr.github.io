<template>
  <div class="success-page">
    <UContainer>
      <div class="py-16 text-center">
        <UIcon
          name="i-heroicons-check-circle"
          class="success-icon w-16 h-16 text-primary-500 mx-auto mb-6"
        />
        <h1 class="text-3xl font-bold mb-4">동호회 등록이 완료되었습니다!</h1>
        <p class="text-neutral-600 mb-8">관리자 승인 후 사이트에 표시됩니다.</p>

        <UCard class="max-w-md mx-auto mb-8">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">승인 안내</h3>
            <p class="text-sm text-neutral-600 mb-4">승인은 보통 1-2일 소요됩니다.</p>
            <p class="text-sm text-neutral-600 mb-6">
              빠른 승인을 원하시거나 문의사항이 있으시면 관리자에게 연락해주세요.
            </p>

            <UButton
              icon="i-simple-icons-kakaotalk"
              label="관리자에게 문의하기"
              color="primary"
              size="lg"
              class="w-full"
              @click="openAdminChat"
            />
          </div>
        </UCard>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton to="/clubs" variant="ghost" size="lg"> 동호회 목록 보기 </UButton>
          <UButton to="/" variant="ghost" size="lg"> 홈으로 </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const { getAdminChatUrl } = useSiteSettings()

const openAdminChat = async () => {
  try {
    const url = await getAdminChatUrl()
    window.open(url, '_blank')
  } catch (error) {
    console.error('Failed to get admin chat URL:', error)
    // 에러 토스트 표시
  }
}
</script>

<style scoped>
.success-icon {
  @apply text-primary-500;
}
</style>
