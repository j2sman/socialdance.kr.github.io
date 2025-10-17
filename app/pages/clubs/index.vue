<template>
  <div class="clubs-page">
    <UContainer>
      <div class="py-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold">동호회 목록</h1>
            <p class="text-neutral-600 mt-2">전국의 라틴댄스 동호회를 찾아보세요</p>
          </div>
          <UButton :to="`/${locale}/clubs/create`" color="primary" icon="i-heroicons-plus">
            동호회 등록
          </UButton>
        </div>

        <!-- 필터 및 검색 -->
        <div class="mb-8">
          <UCard>
            <div class="flex flex-col md:flex-row gap-4">
              <UInput
                v-model="searchQuery"
                placeholder="동호회명으로 검색..."
                icon="i-heroicons-magnifying-glass"
                class="flex-1"
              />
              <USelect
                v-model="selectedDanceType"
                :items="danceTypeFilterOptions"
                placeholder="댄스 타입 필터"
                class="w-full md:w-48"
              />
            </div>
          </UCard>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="pending" class="text-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>동호회 목록을 불러오는 중...</p>
        </div>

        <!-- 빈 상태 -->
        <div v-else-if="filteredClubs.length === 0" class="text-center py-12">
          <UIcon name="i-heroicons-users" class="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold mb-2">등록된 동호회가 없습니다</h3>
          <p class="text-neutral-600 mb-6">첫 번째 동호회를 등록해보세요!</p>
          <UButton :to="`/${locale}/clubs/create`" color="primary" icon="i-heroicons-plus">
            동호회 등록하기
          </UButton>
        </div>

        <!-- 동호회 목록 -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="club in filteredClubs"
            :key="club.id"
            class="hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateTo(`/clubs/${club.id}`)"
          >
            <template #header>
              <div class="flex justify-between items-start">
                <h3 class="text-xl font-semibold">
                  {{ club.name }}
                </h3>
                <UBadge
                  v-if="club.dance_types && club.dance_types.length > 0"
                  color="success"
                  variant="soft"
                >
                  {{ club.dance_types.length }}개 댄스
                </UBadge>
              </div>
            </template>

            <!-- 댄스 타입 -->
            <div v-if="club.dance_types && club.dance_types.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="danceType in club.dance_types.slice(0, 3)"
                  :key="danceType"
                  color="success"
                  variant="soft"
                  size="sm"
                >
                  {{ getDanceTypeLabel(danceType) }}
                </UBadge>
                <UBadge v-if="club.dance_types.length > 3" color="neutral" variant="soft" size="sm">
                  +{{ club.dance_types.length - 3 }}개
                </UBadge>
              </div>
            </div>

            <!-- 소셜 링크 -->
            <div v-if="club.social_links && club.social_links.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="link in club.social_links.slice(0, 3)"
                  :key="link.id"
                  color="primary"
                  variant="soft"
                  size="sm"
                >
                  {{ getPlatformLabel(link.platform) }}
                </UBadge>
                <UBadge
                  v-if="club.social_links.length > 3"
                  color="neutral"
                  variant="soft"
                  size="sm"
                >
                  +{{ club.social_links.length - 3 }}개
                </UBadge>
              </div>
            </div>

            <!-- 등록일 -->
            <template #footer>
              <div class="flex justify-between items-center text-sm text-neutral-500">
                <span>{{ formatDate(club.created_at) }} 등록</span>
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { Club, DanceType, SocialPlatform } from '~/types'
import { DANCE_TYPE_OPTIONS } from '~/types/common.types'

const { getClubs } = useClubs()
const { locale } = useI18n()
const clubs = ref<Club[]>([])
const pending = ref(true)
const searchQuery = ref('')
const selectedDanceType = ref<DanceType>('all')

const danceTypeFilterOptions: { label: string; value: DanceType }[] = [
  { label: '모든 댄스 타입', value: 'all' as DanceType },
  ...DANCE_TYPE_OPTIONS,
]

const filteredClubs = computed(() => {
  let filtered = clubs.value

  // 검색어 필터
  if (searchQuery.value) {
    filtered = filtered.filter(club =>
      club.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 댄스 타입 필터
  if (selectedDanceType.value) {
    filtered = filtered.filter(club =>
      club.dance_types?.includes(selectedDanceType.value as unknown as DanceType)
    )
  }

  return filtered
})

const getDanceTypeLabel = (value: DanceType) => {
  const option = danceTypeOptions.find(opt => opt.value === value)
  return option ? option.label : value
}

const getPlatformLabel = (platform: SocialPlatform) => {
  const platformLabels: Record<SocialPlatform, string> = {
    instagram: '인스타그램',
    kakaotalk: '오픈카톡',
    daumcafe: '다음카페',
    navercafe: '네이버카페',
    youtube: '유튜브',
    notion: 'Notion',
    other: '기타',
  }
  return platformLabels[platform] || platform
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR')
}

onMounted(async () => {
  try {
    clubs.value = await getClubs()
  } catch (error) {
    console.error('Failed to load clubs:', error)
  } finally {
    pending.value = false
  }
})
</script>
