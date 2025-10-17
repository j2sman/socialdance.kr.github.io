import type { DanceType, MapProvider, SocialPlatform } from '.'

// 공통 옵션 상수들
export const DANCE_TYPE_OPTIONS: { label: string; value: DanceType }[] = [
  { label: '살사 (Salsa)', value: 'salsa' as DanceType },
  { label: '바차타 (Bachata)', value: 'bachata' as DanceType },
  { label: '주크 (Zouk)', value: 'zouk' as DanceType },
  { label: '차차차 (Cha Cha Cha)', value: 'chachacha' as DanceType },
  { label: '룸바 (Rumba)', value: 'rumba' as DanceType },
  { label: '삼바 (Samba)', value: 'samba' as DanceType },
  { label: '파소도블 (Paso Doble)', value: 'pasodoble' as DanceType },
  { label: '자이브 (Jive)', value: 'jive' as DanceType },
  { label: '메렝게 (Merengue)', value: 'merengue' as DanceType },
  { label: '기타', value: 'other' as DanceType },
] as const

export const SOCIAL_PLATFORM_OPTIONS: { label: string; value: SocialPlatform }[] = [
  { label: '인스타그램', value: 'instagram' as SocialPlatform },
  { label: '오픈카톡', value: 'kakaotalk' as SocialPlatform },
  { label: '다음카페', value: 'daumcafe' as SocialPlatform },
  { label: '네이버카페', value: 'navercafe' as SocialPlatform },
  { label: '유튜브', value: 'youtube' as SocialPlatform },
  { label: 'Notion', value: 'notion' as SocialPlatform },
  { label: '기타', value: 'other' as SocialPlatform },
] as const

export const MAP_PROVIDER_OPTIONS: { label: string; value: MapProvider }[] = [
  { label: '카카오맵', value: 'kakao' as MapProvider },
  { label: '네이버지도', value: 'naver' as MapProvider },
  { label: '구글맵', value: 'google' as MapProvider },
] as const
