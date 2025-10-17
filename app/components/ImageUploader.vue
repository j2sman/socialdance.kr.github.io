<template>
  <div class="image-uploader">
    <h3>사진 (선택사항)</h3>
    <p class="text-sm text-neutral-600 mb-4">동호회/라틴바를 소개할 사진을 업로드해주세요.</p>

    <div
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @drop="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
    >
      <UIcon name="i-heroicons-photo" class="upload-icon" />
      <p>파일을 드래그하거나 클릭하여 업로드</p>
      <UButton icon="i-heroicons-plus" label="파일 선택" variant="outline" @click="selectFiles" />
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <div v-if="images.length > 0" class="image-preview">
      <div v-for="(image, index) in images" :key="index" class="image-item">
        <img :src="image.preview" :alt="`이미지 ${index + 1}`" />
        <UButton
          icon="i-heroicons-trash"
          color="error"
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
  newImages.forEach(file => {
    if (!(file as ImageFile).preview) {
      ;(file as ImageFile).preview = URL.createObjectURL(file)
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
  images.value.forEach(file => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
  })
})
</script>

<style scoped>
.upload-area {
  border: 2px dashed #d4d4d8;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #10b981;
  background-color: #ecfdf5;
}

.upload-icon {
  width: 3rem;
  height: 3rem;
  color: #a3a3a3;
  margin: 0 auto 1rem;
}

.image-preview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .image-preview {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.image-item {
  position: relative;
}

.image-item img {
  width: 100%;
  height: 8rem;
  object-fit: cover;
  border-radius: 0.5rem;
}

.image-item button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0 0.2, 1);
  transition-duration: 150ms;
}

.image-item:hover button {
  opacity: 1;
}
</style>
