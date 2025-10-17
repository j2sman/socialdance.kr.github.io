<script setup lang="ts">
const colorMode = useColorMode()
const { locale } = useI18n()

const color = computed(() => (colorMode.value === 'dark' ? '#1b1718' : 'white'))

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: locale,
  },
})

// hydration 문제 방지를 위해 클라이언트에서만 실행
const title = computed(() => {
  if (process.client) {
    return $t('home.hero.title')
  }
  return 'Social Dance Korea'
})

const description = computed(() => {
  if (process.client) {
    return $t('home.hero.description')
  }
  return '한국의 소셜 댄스 커뮤니티'
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
