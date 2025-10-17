<template>
  <div class="image-uploader">
    <h3>사진 (선택사항)</h3>
    <p class="text-sm text-gray-600 mb-4">
      동호회/라틴바를 소개할 사진을 업로드해주세요.
    </p>

    <div
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @drop="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
    >
      <UIcon name="i-heroicons-photo" class="upload-icon" />
      <p>파일을 드래그하거나 클릭하여 업로드</p>
      <UButton
        icon="i-heroicons-plus"
        label="파일 선택"
        variant="outline"
        @click="selectFiles"
      />
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      >
    </div>

    <div v-if="images.length > 0" class="image-preview">
      <div v-for="(image, index) in images" :key="index" class="image-item">
        <img :src="image.preview" :alt="`이미지 ${index + 1}`">
        <UButton
          icon="i-heroicons-trash"
          color="red"
          variant="ghost"
          size="sm"
          @click="removeImage(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ImageFile extends File {
  preview?: string
}

const props = defineProps<{
  modelValue: File[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: File[]]
}>()

const images = ref<ImageFile[]>(props.modelValue || [])
const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement>()

const selectFiles = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (files: File[]) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  const newImages = [...images.value, ...imageFiles]

  // 미리보기 URL 생성
  newImages.forEach((file) => {
    if (!(file as ImageFile).preview) {
      (file as ImageFile).preview = URL.createObjectURL(file)
    }
  })

  images.value = newImages
  emit('update:modelValue', images.value)
}

const removeImage = (index: number) => {
  const file = images.value[index]
  if (file.preview) {
    URL.revokeObjectURL(file.preview)
  }

  images.value.splice(index, 1)
  emit('update:modelValue', images.value)
}

// 컴포넌트 언마운트 시 URL 정리
onUnmounted(() => {
  images.value.forEach((file) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
  })
})
</script>

<style scoped>
.upload-area {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors;
}

.upload-area:hover,
.upload-area.drag-over {
  @apply border-blue-500 bg-blue-50;
}

.upload-icon {
  @apply w-12 h-12 text-gray-400 mx-auto mb-4;
}

.image-preview {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4 mt-4;
}

.image-item {
  @apply relative group;
}

.image-item img {
  @apply w-full h-32 object-cover rounded-lg;
}

.image-item button {
  @apply absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity;
}
</style>
