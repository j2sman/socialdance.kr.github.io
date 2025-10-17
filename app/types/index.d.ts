import type { AvatarProps } from '@nuxt/ui'

// 라틴댄스 타입
export type DanceType =
  | 'salsa'
  | 'bachata'
  | 'zouk'
  | 'chachacha'
  | 'rumba'
  | 'samba'
  | 'pasodoble'
  | 'jive'
  | 'merengue'
  | 'other'

// 승인 상태
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

// 엔티티 타입
export type EntityType = 'club' | 'latin_bar'

// 소셜 플랫폼
export type SocialPlatform =
  | 'instagram'
  | 'kakaotalk'
  | 'daumcafe'
  | 'navercafe'
  | 'youtube'
  | 'notion'
  | 'other'

// 지도 제공자
export type MapProvider = 'kakao' | 'naver' | 'google'

// 관리자
export interface Admin {
  created_at: string
  email: string
  id: string
  password: string
  updated_at: string
}

// 사이트 설정
export interface SiteSetting {
  description?: string
  id: string
  key: string
  updated_at: string
  value: string
}

// 동호회
export interface Club {
  approved_at?: string
  approved_by?: string
  created_at: string
  dance_types?: DanceType[]
  description?: string
  description_en?: string
  google_calendar_id?: string
  id: string
  images?: Image[]
  name: string
  name_en?: string
  social_links?: SocialLink[]
  status: ApprovalStatus
  updated_at: string
}

// 라틴바
export interface LatinBar {
  address: string
  address_en?: string
  approved_at?: string
  approved_by?: string
  created_at: string
  description?: string
  description_en?: string
  id: string
  images?: Image[]
  latitude?: number
  longitude?: number
  map_provider?: MapProvider
  name: string
  name_en?: string
  social_links?: SocialLink[]
  status: ApprovalStatus
  updated_at: string
}

// 소셜 링크
export interface SocialLink {
  created_at: string
  entity_id: string
  entity_type: EntityType
  id: string
  password?: string
  platform: SocialPlatform
  url: string
}

// 이미지
export interface Image {
  created_at: string
  entity_id: string
  entity_type: EntityType
  file_data?: Uint8Array
  file_name: string
  file_size?: number
  id: string
  mime_type?: string
  order_index: number
}

// 수정 요청
export interface UpdateRequest {
  approved_at?: string
  approved_by?: string
  created_at: string
  entity_id: string
  entity_type: EntityType
  id: string
  request_data: any
  requested_by?: string
  status: ApprovalStatus
  updated_at: string
}

// API 응답 타입
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

// 폼 데이터 타입
export interface ClubFormData {
  dance_types: DanceType[]
  description?: string
  description_en?: string
  google_calendar_id?: string
  images: File[]
  name: string
  name_en?: string
  social_links: Omit<SocialLink, 'id' | 'entity_type' | 'entity_id' | 'created_at'>[]
}

export interface LatinBarFormData {
  address: string
  address_en?: string
  description?: string
  description_en?: string
  images: File[]
  latitude?: number
  longitude?: number
  map_provider?: MapProvider
  name: string
  name_en?: string
  social_links: Omit<SocialLink, 'id' | 'entity_type' | 'entity_id' | 'created_at'>[]
}

// 통계
export interface Stat {
  icon: string
  title: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

// 기간
export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  end: Date
  start: Date
}
