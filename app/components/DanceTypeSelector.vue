<template>
  <div class="dance-type-selector">
    <h3>라틴댄스 타입 (선택사항)</h3>
    <p class="text-sm text-neutral-600 mb-4">해당하는 댄스 타입을 모두 선택해주세요.</p>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <UCheckbox
        v-for="danceType in DANCE_TYPE_OPTIONS"
        :key="danceType.value"
        :model-value="selectedTypes.includes(danceType.value)"
        :label="danceType.label"
        class="flex items-center"
        @update:model-value="(checked: boolean) => toggleDanceType(danceType.value, checked)"
      />
    </div>

    <div v-if="selectedTypes.length > 0" class="mt-4">
      <p class="text-sm text-neutral-600">선택된 댄스 타입:</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <UBadge v-for="type in selectedTypes" :key="type" color="success" variant="soft">
          {{ getDanceTypeLabel(type) }}
        </UBadge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DanceType } from '~/types'
import { DANCE_TYPE_OPTIONS } from '../types/common.types'

const props = defineProps<{
  modelValue: DanceType[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DanceType[]]
}>()

const selectedTypes = computed(() => props.modelValue || [])

const toggleDanceType = (danceType: DanceType, checked: boolean) => {
  const currentTypes = [...selectedTypes.value]
  if (checked) {
    if (!currentTypes.includes(danceType)) {
      currentTypes.push(danceType)
    }
  } else {
    const index = currentTypes.indexOf(danceType)
    if (index > -1) {
      currentTypes.splice(index, 1)
    }
  }
  emit('update:modelValue', currentTypes)
}

const getDanceTypeLabel = (value: DanceType) => {
  const option = DANCE_TYPE_OPTIONS.find(opt => opt.value === value)
  return option ? option.label : value
}
</script>
