<script setup lang="ts">
const { getAdminChatUrl } = useSiteSettings()

const openAdminChat = async () => {
  try {
    const url = await getAdminChatUrl()
    window.open(url, '_blank')
  } catch (error) {
    console.error('Failed to get admin chat URL:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <UContainer>
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <UIcon name="i-heroicons-heart" class="w-8 h-8 text-red-500" />
            <span class="text-xl font-bold text-gray-900">{{ $t('common.latinDance') }}</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <NuxtLink to="/" class="text-gray-700 hover:text-red-600 transition-colors">
              {{ $t('navigation.home') }}
            </NuxtLink>
            <NuxtLink to="/clubs" class="text-gray-700 hover:text-red-600 transition-colors">
              {{ $t('navigation.clubs') }}
            </NuxtLink>
            <NuxtLink to="/bars" class="text-gray-700 hover:text-red-600 transition-colors">
              {{ $t('navigation.bars') }}
            </NuxtLink>
          </nav>

          <!-- Right side buttons -->
          <div class="flex items-center space-x-4">
            <!-- Language Selector -->
            <LanguageSelector />

            <!-- Admin Contact Button -->
            <UButton
              icon="i-simple-icons-kakaotalk"
              :label="$t('common.adminInquiry')"
              color="yellow"
              variant="outline"
              @click="openAdminChat"
            />
          </div>
        </div>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <UContainer>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- About -->
          <div>
            <h3 class="text-lg font-semibold mb-4">
              {{ $t('footer.about.title') }}
            </h3>
            <p class="text-gray-400">
              {{ $t('footer.about.description') }}
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">
              {{ $t('footer.links.title') }}
            </h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/clubs" class="text-gray-400 hover:text-white transition-colors">
                  {{ $t('footer.links.findClubs') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/bars" class="text-gray-400 hover:text-white transition-colors">
                  {{ $t('footer.links.findBars') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/clubs/create"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  {{ $t('footer.links.registerClub') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/bars/create"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  {{ $t('footer.links.registerBar') }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-lg font-semibold mb-4">
              {{ $t('footer.contact.title') }}
            </h3>
            <p class="text-gray-400 mb-4">
              {{ $t('footer.contact.description') }}
            </p>
            <UButton
              icon="i-simple-icons-kakaotalk"
              :label="$t('footer.contact.adminChat')"
              color="yellow"
              @click="openAdminChat"
            />
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {{ $t('footer.copyright') }}</p>
        </div>
      </UContainer>
    </footer>
  </div>
</template>
