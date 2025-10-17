<template>
  <div class="admin-dashboard">
    <UContainer>
      <div class="py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">관리자 대시보드</h1>
          <p class="text-neutral-600">승인 대기 중인 동호회와 라틴바를 관리하세요.</p>
        </div>

        <!-- 승인 대기 현황 카드 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <UCard>
            <div class="p-6">
              <div class="flex items-center">
                <UIcon name="i-heroicons-users" class="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p class="text-sm font-medium text-gray-600">동호회 승인 대기</p>
                  <p class="text-2xl font-bold text-gray-900">{{ pendingClubsCount }}</p>
                </div>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="p-6">
              <div class="flex items-center">
                <UIcon name="i-heroicons-building-office" class="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p class="text-sm font-medium text-gray-600">라틴바 승인 대기</p>
                  <p class="text-2xl font-bold text-gray-900">{{ pendingBarsCount }}</p>
                </div>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="p-6">
              <div class="flex items-center">
                <UIcon name="i-heroicons-pencil-square" class="w-8 h-8 text-orange-500 mr-3" />
                <div>
                  <p class="text-sm font-medium text-gray-600">수정 요청 대기</p>
                  <p class="text-2xl font-bold text-gray-900">{{ pendingUpdatesCount }}</p>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- 빠른 액션 버튼 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <UButton
            to="/admin/clubs/pending"
            color="blue"
            variant="outline"
            size="lg"
            class="justify-start"
          >
            <UIcon name="i-heroicons-users" class="mr-2" />
            동호회 승인 관리
          </UButton>

          <UButton
            to="/admin/bars/pending"
            color="green"
            variant="outline"
            size="lg"
            class="justify-start"
          >
            <UIcon name="i-heroicons-building-office" class="mr-2" />
            라틴바 승인 관리
          </UButton>

          <UButton
            to="/admin/update-requests"
            color="orange"
            variant="outline"
            size="lg"
            class="justify-start"
          >
            <UIcon name="i-heroicons-pencil-square" class="mr-2" />
            수정 요청 관리
          </UButton>

          <UButton
            to="/admin/settings"
            color="gray"
            variant="outline"
            size="lg"
            class="justify-start"
          >
            <UIcon name="i-heroicons-cog-6-tooth" class="mr-2" />
            사이트 설정
          </UButton>
        </div>

        <!-- 최근 활동 -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">최근 활동</h3>
          </template>

          <div class="space-y-4">
            <div v-if="recentActivities.length === 0" class="text-center py-8 text-gray-500">
              최근 활동이 없습니다.
            </div>

            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div class="flex items-center">
                <UIcon
                  :name="getActivityIcon(activity.type)"
                  :class="getActivityIconColor(activity.type)"
                  class="w-5 h-5 mr-3"
                />
                <div>
                  <p class="font-medium">{{ activity.description }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(activity.created_at) }}</p>
                </div>
              </div>
              <UBadge :color="getActivityStatusColor(activity.status)" variant="soft">
                {{ getActivityStatusText(activity.status) }}
              </UBadge>
            </div>
          </div>
        </UCard>

        <!-- 로그아웃 버튼 -->
        <div class="mt-8 text-center">
          <UButton @click="handleLogout" color="red" variant="outline"> 로그아웃 </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// 관리자 인증 미들웨어 적용
definePageMeta({
  middleware: 'admin-auth',
})

const { logout } = useAdminAuth()
const toast = useToast()

// 대시보드 데이터
const pendingClubsCount = ref(0)
const pendingBarsCount = ref(0)
const pendingUpdatesCount = ref(0)
const recentActivities = ref([])

// 데이터 로드
const loadDashboardData = async () => {
  try {
    // TODO: 실제 API 호출로 대체
    // const [clubs, bars, updates, activities] = await Promise.all([
    //   $fetch('/api/admin/clubs/pending'),
    //   $fetch('/api/admin/bars/pending'),
    //   $fetch('/api/admin/update-requests'),
    //   $fetch('/api/admin/activities')
    // ])

    // 임시 데이터
    pendingClubsCount.value = 3
    pendingBarsCount.value = 1
    pendingUpdatesCount.value = 2
    recentActivities.value = [
      {
        id: 1,
        type: 'club',
        description: '새로운 동호회 등록 요청',
        status: 'pending',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        type: 'bar',
        description: '라틴바 정보 수정 요청',
        status: 'pending',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ]
  } catch (error) {
    console.error('대시보드 데이터 로드 실패:', error)
  }
}

// 활동 아이콘 및 색상
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'club':
      return 'i-heroicons-users'
    case 'bar':
      return 'i-heroicons-building-office'
    case 'update':
      return 'i-heroicons-pencil-square'
    default:
      return 'i-heroicons-information-circle'
  }
}

const getActivityIconColor = (type: string) => {
  switch (type) {
    case 'club':
      return 'text-blue-500'
    case 'bar':
      return 'text-green-500'
    case 'update':
      return 'text-orange-500'
    default:
      return 'text-gray-500'
  }
}

const getActivityStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'yellow'
    case 'approved':
      return 'green'
    case 'rejected':
      return 'red'
    default:
      return 'gray'
  }
}

const getActivityStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return '대기중'
    case 'approved':
      return '승인됨'
    case 'rejected':
      return '거절됨'
    default:
      return '알 수 없음'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ko-KR')
}

const handleLogout = () => {
  logout()
  toast.add({
    title: '로그아웃 완료',
    description: '성공적으로 로그아웃되었습니다.',
    color: 'green',
  })
  navigateTo('/admin/login')
}

// 페이지 로드 시 데이터 가져오기
onMounted(() => {
  loadDashboardData()
})
</script>
