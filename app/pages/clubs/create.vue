<template>
  <div class="create-club-page">
    <UContainer>
      <div class="py-8">
        <div class="max-w-2xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold mb-4">동호회 등록</h1>
            <p class="text-neutral-600">
              새로운 동호회를 등록해주세요. 관리자 승인 후 사이트에 표시됩니다.
            </p>
          </div>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">동호회 정보 입력</h2>
            </template>

            <UForm :state="form" class="space-y-6" @submit="onSubmit">
              <!-- 기본 정보 -->
              <UFormGroup :label="$t('clubs.name')" name="name" required>
                <UInput v-model="form.name" :placeholder="$t('clubs.namePlaceholder')" required />
              </UFormGroup>

              <!-- 영어 이름 (선택사항) -->
              <UFormGroup :label="$t('clubs.nameEn')" name="name_en">
                <UInput v-model="form.name_en" :placeholder="$t('clubs.nameEnPlaceholder')" />
              </UFormGroup>

              <!-- 설명 -->
              <UFormGroup :label="$t('clubs.description')" name="description">
                <UTextarea
                  v-model="form.description"
                  :placeholder="$t('clubs.descriptionPlaceholder')"
                  :rows="3"
                />
              </UFormGroup>

              <!-- 영어 설명 (선택사항) -->
              <UFormGroup :label="$t('clubs.descriptionEn')" name="description_en">
                <UTextarea
                  v-model="form.description_en"
                  :placeholder="$t('clubs.descriptionEnPlaceholder')"
                  :rows="3"
                />
              </UFormGroup>

              <!-- 라틴댄스 타입 선택 -->
              <DanceTypeSelector v-model="form.dance_types" />

              <!-- Google Calendar 연동 -->
              <UFormGroup label="수업일정 (선택사항)" name="googleCalendarId">
                <UInput
                  v-model="form.google_calendar_id"
                  placeholder="Google Calendar ID (선택사항)"
                />
                <template #help> Google Calendar 공유 링크에서 ID를 추출하여 입력하세요 </template>
              </UFormGroup>

              <!-- 사이트 링크 -->
              <SocialLinkInput v-model="form.social_links" />

              <!-- 사진 관리 -->
              <ImageUploader v-model="form.images" />

              <div class="flex gap-4 pt-6">
                <UButton type="submit" :loading="loading" size="lg" color="primary" class="flex-1">
                  동호회 등록
                </UButton>
                <UButton :to="`/${locale}/clubs`" variant="ghost" size="lg"> 취소 </UButton>
              </div>
            </UForm>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { ClubFormData } from '~/types'

const { createClub } = useClubs()
const { locale } = useI18n()
const form = reactive<ClubFormData>({
  name: '',
  name_en: '',
  description: '',
  description_en: '',
  dance_types: [],
  google_calendar_id: '',
  social_links: [{ platform: 'instagram', url: '', password: '' }],
  images: [],
})

const loading = ref(false)

const onSubmit = async () => {
  if (!form.name.trim()) {
    // 에러 토스트 표시
    return
  }

  loading.value = true
  try {
    await createClub(form)
    await navigateTo('/clubs/create/success')
  } catch (error) {
    console.error('동호회 등록 실패:', error)
    // 에러 토스트 표시
  } finally {
    loading.value = false
  }
}
</script>
