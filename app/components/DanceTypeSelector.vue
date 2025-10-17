<template>
  <div class="dance-type-selector">
    <h3>라틴댄스 타입 (선택사항)</h3>
    <p class="text-sm text-gray-600 mb-4">
      해당하는 댄스 타입을 모두 선택해주세요.
    </p>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <UCheckbox
        v-for="danceType in danceTypeOptions"
        :key="danceType.value"
        v-model="selectedTypes"
        :value="danceType.value"
        :label="danceType.label"
        class="flex items-center"
      />
    </div>

    <div v-if="selectedTypes.length > 0" class="mt-4">
      <p class="text-sm text-gray-600">
        선택된 댄스 타입:
      </p>
      <div class="flex flex-wrap gap-2 mt-2">
        <UBadge
          v-for="type in selectedTypes"
          :key="type"
          color="blue"
          variant="soft"
        >
          {{ getDanceTypeLabel(type) }}
        </UBadge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: DanceType[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DanceType[]]
}>()

const selectedTypes = computed({
  get: () => props.modelValue || [],
  set: value => emit('update:modelValue', value)
})

const danceTypeOptions = [
  { label: '살사 (Salsa)', value: 'salsa' },
  { label: '바차타 (Bachata)', value: 'bachata' },
  { label: '주크 (Zouk)', value: 'zouk' },
  { label: '차차차 (Cha Cha Cha)', value: 'chachacha' },
  { label: '룸바 (Rumba)', value: 'rumba' },
  { label: '삼바 (Samba)', value: 'samba' },
  { label: '파소도블 (Paso Doble)', value: 'pasodoble' },
  { label: '자이브 (Jive)', value: 'jive' },
  { label: '메렝게 (Merengue)', value: 'merengue' },
  { label: '기타', value: 'other' }
]

const getDanceTypeLabel = (value: DanceType) => {
  const option = danceTypeOptions.find(opt => opt.value === value)
  return option ? option.label : value
}
</script>
