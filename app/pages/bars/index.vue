<template>
  <div class="bars-page">
    <UContainer>
      <div class="py-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold">라틴바 목록</h1>
            <p class="text-neutral-600 mt-2">전국의 라틴바를 찾아보세요</p>
          </div>
          <UButton :to="`/${locale}/bars/create`" color="primary" icon="i-heroicons-plus">
            라틴바 등록
          </UButton>
        </div>

        <!-- 필터 및 검색 -->
        <div class="mb-8">
          <UCard>
            <div class="flex flex-col md:flex-row gap-4">
              <UInput
                v-model="searchQuery"
                placeholder="라틴바명으로 검색..."
                icon="i-heroicons-magnifying-glass"
                class="flex-1"
              />
              <UInput
                v-model="locationQuery"
                placeholder="지역으로 검색..."
                icon="i-heroicons-map-pin"
                class="flex-1"
              />
            </div>
          </UCard>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="pending" class="text-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>라틴바 목록을 불러오는 중...</p>
        </div>

        <!-- 빈 상태 -->
        <div v-else-if="filteredBars.length === 0" class="text-center py-12">
          <UIcon
            name="i-heroicons-building-office"
            class="w-16 h-16 text-neutral-400 mx-auto mb-4"
          />
          <h3 class="text-xl font-semibold mb-2">등록된 라틴바가 없습니다</h3>
          <p class="text-neutral-600 mb-6">첫 번째 라틴바를 등록해보세요!</p>
          <UButton :to="`/${locale}/bars/create`" color="primary" icon="i-heroicons-plus">
            라틴바 등록하기
          </UButton>
        </div>

        <!-- 라틴바 목록 -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="bar in filteredBars"
            :key="bar.id"
            class="hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateTo(`/bars/${bar.id}`)"
          >
            <template #header>
              <div class="flex justify-between items-start">
                <h3 class="text-xl font-semibold">
                  {{ bar.name }}
                </h3>
                <UBadge v-if="bar.map_provider" color="primary" variant="soft">
                  {{ getMapProviderLabel(bar.map_provider) }}
                </UBadge>
              </div>
            </template>

            <!-- 주소 -->
            <div class="mb-4">
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0"
                />
                <p class="text-neutral-600 text-sm">
                  {{ bar.address }}
                </p>
              </div>
            </div>

            <!-- 소셜 링크 -->
            <div v-if="bar.social_links && bar.social_links.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="link in bar.social_links.slice(0, 3)"
                  :key="link.id"
                  color="primary"
                  variant="soft"
                  size="sm"
                >
                  {{ getPlatformLabel(link.platform) }}
                </UBadge>
                <UBadge v-if="bar.social_links.length > 3" color="neutral" variant="soft" size="sm">
                  +{{ bar.social_links.length - 3 }}개
                </UBadge>
              </div>
            </div>

            <!-- 등록일 -->
            <template #footer>
              <div class="flex justify-between items-center text-sm text-neutral-500">
                <span>{{ formatDate(bar.created_at) }} 등록</span>
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
import type { LatinBar, MapProvider, SocialPlatform } from '~/types'

const { locale } = useI18n()
const { getLatinBars } = useLatinBars()
const bars = ref<LatinBar[]>([])
const pending = ref(true)
const searchQuery = ref('')
const locationQuery = ref('')

const filteredBars = computed(() => {
  let filtered = bars.value

  // 검색어 필터
  if (searchQuery.value) {
    filtered = filtered.filter(bar =>
      bar.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 지역 필터
  if (locationQuery.value) {
    filtered = filtered.filter(bar =>
      bar.address.toLowerCase().includes(locationQuery.value.toLowerCase())
    )
  }

  return filtered
})

const getMapProviderLabel = (provider: MapProvider) => {
  const providerLabels: Record<MapProvider, string> = {
    kakao: '카카오맵',
    naver: '네이버지도',
    google: '구글맵',
  }
  return providerLabels[provider] || provider
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
    bars.value = await getLatinBars()
  } catch (error) {
    console.error('Failed to load bars:', error)
  } finally {
    pending.value = false
  }
})
</script>
