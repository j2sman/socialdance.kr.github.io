<template>
  <div class="create-bar-page">
    <UContainer>
      <div class="py-8">
        <div class="max-w-2xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold mb-4">
              라틴바 등록
            </h1>
            <p class="text-gray-600">
              새로운 라틴바를 등록해주세요. 관리자 승인 후 사이트에 표시됩니다.
            </p>
          </div>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">
                라틴바 정보 입력
              </h2>
            </template>

            <UForm :state="form" class="space-y-6" @submit="onSubmit">
              <!-- 기본 정보 -->
              <UFormGroup label="라틴바명" name="name" required>
                <UInput
                  v-model="form.name"
                  placeholder="라틴바명을 입력해주세요"
                  required
                />
              </UFormGroup>

              <UFormGroup label="주소" name="address" required>
                <UInput
                  v-model="form.address"
                  placeholder="주소를 입력해주세요"
                  required
                />
              </UFormGroup>

              <!-- 지도 제공자 선택 -->
              <UFormGroup label="지도 제공자 (선택사항)" name="mapProvider">
                <USelect
                  v-model="form.map_provider"
                  :options="mapProviderOptions"
                  placeholder="지도 제공자를 선택하세요"
                />
              </UFormGroup>

              <!-- 사이트 링크 -->
              <SocialLinkInput v-model="form.social_links" />

              <!-- 사진 관리 -->
              <ImageUploader v-model="form.images" />

              <div class="flex gap-4 pt-6">
                <UButton
                  type="submit"
                  :loading="loading"
                  size="lg"
                  color="primary"
                  class="flex-1"
                >
                  라틴바 등록
                </UButton>
                <UButton to="/bars" variant="ghost" size="lg">
                  취소
                </UButton>
              </div>
            </UForm>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const { createLatinBar } = useLatinBars()

const form = reactive<LatinBarFormData>({
  name: '',
  address: '',
  latitude: undefined,
  longitude: undefined,
  map_provider: undefined,
  social_links: [{ platform: '', url: '', password: '' }],
  images: []
})

const loading = ref(false)

const mapProviderOptions = [
  { label: '카카오맵', value: 'kakao' },
  { label: '네이버지도', value: 'naver' },
  { label: '구글맵', value: 'google' }
]

const onSubmit = async () => {
  if (!form.name.trim() || !form.address.trim()) {
    // 에러 토스트 표시
    return
  }

  loading.value = true
  try {
    await createLatinBar(form)
    await navigateTo('/bars/create/success')
  } catch (error) {
    console.error('라틴바 등록 실패:', error)
    // 에러 토스트 표시
  } finally {
    loading.value = false
  }
}
</script>
