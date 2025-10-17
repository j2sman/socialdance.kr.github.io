<template>
  <div class="home-page">
    <UContainer>
      <!-- Hero Section -->
      <div class="hero-section text-center py-16">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          {{ $t('home.hero.title') }}
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {{ $t('home.hero.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton to="/clubs" size="lg" color="primary" icon="i-heroicons-users">
            {{ $t('home.hero.findClubs') }}
          </UButton>
          <UButton to="/bars" size="lg" variant="outline" icon="i-heroicons-building-office">
            {{ $t('home.hero.findBars') }}
          </UButton>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-section py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UCard>
            <div class="text-center">
              <UIcon name="i-heroicons-users" class="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 class="text-2xl font-bold text-blue-600">
                {{ stats.clubs }}
              </h3>
              <p class="text-gray-600">
                {{ $t('home.stats.registeredClubs') }}
              </p>
            </div>
          </UCard>
          <UCard>
            <div class="text-center">
              <UIcon
                name="i-heroicons-building-office"
                class="w-12 h-12 text-green-500 mx-auto mb-4"
              />
              <h3 class="text-2xl font-bold text-green-600">
                {{ stats.bars }}
              </h3>
              <p class="text-gray-600">
                {{ $t('home.stats.registeredBars') }}
              </p>
            </div>
          </UCard>
          <UCard>
            <div class="text-center">
              <UIcon name="i-heroicons-heart" class="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 class="text-2xl font-bold text-red-600">
                {{ stats.total }}
              </h3>
              <p class="text-gray-600">
                {{ $t('home.stats.totalPlaces') }}
              </p>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Recent Clubs -->
      <div class="recent-clubs py-12">
        <h2 class="text-3xl font-bold mb-8 text-center">
          {{ $t('home.recentClubs.title') }}
        </h2>
        <div v-if="pending" class="text-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>{{ $t('common.loading') }}</p>
        </div>
        <div v-else-if="recentClubs.length === 0" class="text-center py-8">
          <UIcon name="i-heroicons-users" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600">
            {{ $t('clubs.noClubs') }}
          </p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="club in recentClubs.slice(0, 6)"
            :key="club.id"
            class="hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateTo(`/clubs/${club.id}`)"
          >
            <template #header>
              <h3 class="text-xl font-semibold">
                {{ club.name }}
              </h3>
            </template>
            <div
              v-if="club.dance_types && club.dance_types.length > 0"
              class="flex flex-wrap gap-2 mb-4"
            >
              <UBadge
                v-for="danceType in club.dance_types"
                :key="danceType"
                color="blue"
                variant="soft"
                size="sm"
              >
                {{ getDanceTypeLabel(danceType) }}
              </UBadge>
            </div>
            <p class="text-sm text-gray-600">
              {{ formatDate(club.created_at) }} {{ $t('home.registered') }}
            </p>
          </UCard>
        </div>
        <div v-if="recentClubs.length > 6" class="text-center mt-8">
          <UButton to="/clubs" variant="outline">
            {{ $t('home.viewAllClubs') }}
          </UButton>
        </div>
      </div>

      <!-- Recent Bars -->
      <div class="recent-bars py-12">
        <h2 class="text-3xl font-bold mb-8 text-center">
          {{ $t('home.recentBars.title') }}
        </h2>
        <div v-if="pending" class="text-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>{{ $t('common.loading') }}</p>
        </div>
        <div v-else-if="recentBars.length === 0" class="text-center py-8">
          <UIcon name="i-heroicons-building-office" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600">
            {{ $t('bars.noBars') }}
          </p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="bar in recentBars.slice(0, 6)"
            :key="bar.id"
            class="hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateTo(`/bars/${bar.id}`)"
          >
            <template #header>
              <h3 class="text-xl font-semibold">
                {{ bar.name }}
              </h3>
            </template>
            <p class="text-gray-600 mb-2">
              {{ bar.address }}
            </p>
            <p class="text-sm text-gray-500">
              {{ formatDate(bar.created_at) }} {{ $t('home.registered') }}
            </p>
          </UCard>
        </div>
        <div v-if="recentBars.length > 6" class="text-center mt-8">
          <UButton to="/bars" variant="outline">
            {{ $t('home.viewAllBars') }}
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const { getClubs } = useClubs()
const { getLatinBars } = useLatinBars()
const { locale } = useI18n()

const recentClubs = ref<Club[]>([])
const recentBars = ref<LatinBar[]>([])
const pending = ref(true)

const stats = computed(() => ({
  clubs: recentClubs.value.length,
  bars: recentBars.value.length,
  total: recentClubs.value.length + recentBars.value.length,
}))

const getDanceTypeLabel = (value: DanceType) => {
  const { getDanceTypeName } = useLocaleUtils()
  return getDanceTypeName(value, locale.value)
}

const formatDate = (dateString: string) => {
  const localeCode = locale.value === 'ko' ? 'ko-KR' : 'en-US'
  return new Date(dateString).toLocaleDateString(localeCode)
}

onMounted(async () => {
  try {
    const [clubs, bars] = await Promise.all([getClubs(), getLatinBars()])

    recentClubs.value = clubs
    recentBars.value = bars
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    pending.value = false
  }
})
</script>
