<template>
  <div class="relative">
    <UButton
      :label="currentLanguage?.name"
      variant="ghost"
      color="neutral"
      :icon="isOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
      @click="isOpen = !isOpen"
    />

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg z-50 border border-neutral-200 dark:border-neutral-700"
      >
        <div class="py-1">
          <button
            v-for="locale in locales"
            :key="locale.code"
            class="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-between"
            :class="{ 'bg-neutral-100 dark:bg-neutral-700': locale.code === currentLocale }"
            @click="changeLanguage(locale.code)"
          >
            <span>{{ locale.name }}</span>
            <UIcon
              v-if="locale.code === currentLocale"
              name="i-heroicons-check"
              class="w-4 h-4 text-success-600"
            />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const route = useRoute()
const router = useRouter()

const isOpen = ref(false)

const currentLocale = computed(() => locale.value)
const currentLanguage = computed(
  () => locales.value.find(l => l.code === currentLocale.value) || locales.value[0]
)

const changeLanguage = async (newLocale: string) => {
  try {
    // 언어 변경
    await setLocale(newLocale as 'ko' | 'en')

    // 언어 변경 후 현재 경로로 다시 이동 (새로운 locale prefix와 함께)
    const currentPath = route.path
    await router.push(currentPath)

    isOpen.value = false
  } catch (error) {
    console.error('Language change failed:', error)
  }
}

// 외부 클릭 시 닫기 - 클라이언트에서만 실행
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
