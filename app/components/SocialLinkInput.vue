<template>
  <div class="social-links">
    <h3>사이트 주소</h3>
    <div v-for="(link, index) in links" :key="index" class="link-item">
      <USelect
        v-model="link.platform"
        :options="platformOptions"
        placeholder="플랫폼 선택"
        class="flex-1"
      />
      <UInput v-model="link.url" placeholder="URL 입력" class="flex-2" />
      <UInput
        v-if="link.platform === 'kakaotalk'"
        v-model="link.password"
        placeholder="비밀번호"
        class="flex-1"
      />
      <UButton
        icon="i-heroicons-trash"
        color="red"
        variant="ghost"
        @click="removeLink(index)"
      />
    </div>
    <UButton
      icon="i-heroicons-plus"
      label="링크 추가"
      variant="outline"
      @click="addLink"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: Omit<
    SocialLink,
    'id' | 'entity_type' | 'entity_id' | 'created_at'
  >[]
}>()

const emit = defineEmits<{
  'update:modelValue': [
    value: Omit<SocialLink, 'id' | 'entity_type' | 'entity_id' | 'created_at'>[]
  ]
}>()

const platformOptions = [
  { label: '인스타그램', value: 'instagram' },
  { label: '오픈카톡', value: 'kakaotalk' },
  { label: '다음카페', value: 'daumcafe' },
  { label: '네이버카페', value: 'navercafe' },
  { label: '유튜브', value: 'youtube' },
  { label: 'Notion', value: 'notion' },
  { label: '기타', value: 'other' }
]

const links = ref<
  Omit<SocialLink, 'id' | 'entity_type' | 'entity_id' | 'created_at'>[]
>(
  props.modelValue?.length
    ? props.modelValue
    : [{ platform: '', url: '', password: '' }]
)

watch(
  links,
  (newLinks) => {
    emit('update:modelValue', newLinks)
  },
  { deep: true }
)

const addLink = () => {
  links.value.push({ platform: '', url: '', password: '' })
}

const removeLink = (index: number) => {
  if (links.value.length > 1) {
    links.value.splice(index, 1)
  }
}
</script>

<style scoped>
.link-item {
  @apply flex gap-2 mb-2;
}
</style>
