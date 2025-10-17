<template>
  <div class="relative">
    <UButton
      :label="currentLanguage.name"
      variant="ghost"
      color="neutral"
      :icon="isOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
      @click="isOpen = !isOpen"
    />

    <UTransition>
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
      >
        <div class="py-1">
          <button
            v-for="locale in locales"
            :key="locale.code"
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
            :class="{ 'bg-gray-100 dark:bg-gray-700': locale.code === currentLocale }"
            @click="changeLanguage(locale.code)"
          >
            <span>{{ locale.name }}</span>
            <UIcon
              v-if="locale.code === currentLocale"
              name="i-heroicons-check"
              class="w-4 h-4 text-blue-600"
            />
          </button>
        </div>
      </div>
    </UTransition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const isOpen = ref(false)

const currentLocale = computed(() => locale.value)
const currentLanguage = computed(
  () => locales.value.find(l => l.code === currentLocale.value) || locales.value[0]
)

const changeLanguage = async (newLocale: string) => {
  await setLocale(newLocale)
  isOpen.value = false
}

// 외부 클릭 시 닫기
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      isOpen.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
