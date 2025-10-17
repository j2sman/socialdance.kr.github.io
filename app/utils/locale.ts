import type { Database } from '~/types/database.types'

type Club = Database['public']['Tables']['clubs']['Row']
type LatinBar = Database['public']['Tables']['latin_bars']['Row']

/**
 * 현재 locale에 따라 클럽 이름을 반환합니다
 */
export function getClubName(club: Club, locale: string = 'ko'): string {
  if (locale === 'en' && club.name_en) {
    return club.name_en
  }
  return club.name
}

/**
 * 현재 locale에 따라 클럽 설명을 반환합니다
 */
export function getClubDescription(club: Club, locale: string = 'ko'): string | null {
  if (locale === 'en' && club.description_en) {
    return club.description_en
  }
  return club.description
}

/**
 * 현재 locale에 따라 라틴바 이름을 반환합니다
 */
export function getBarName(bar: LatinBar, locale: string = 'ko'): string {
  if (locale === 'en' && bar.name_en) {
    return bar.name_en
  }
  return bar.name
}

/**
 * 현재 locale에 따라 라틴바 주소를 반환합니다
 */
export function getBarAddress(bar: LatinBar, locale: string = 'ko'): string {
  if (locale === 'en' && bar.address_en) {
    return bar.address_en
  }
  return bar.address
}

/**
 * 현재 locale에 따라 라틴바 설명을 반환합니다
 */
export function getBarDescription(bar: LatinBar, locale: string = 'ko'): string | null {
  if (locale === 'en' && bar.description_en) {
    return bar.description_en
  }
  return bar.description
}

/**
 * 댄스 타입을 현재 locale에 맞게 번역합니다
 */
export function getDanceTypeName(danceType: string, locale: string = 'ko'): string {
  const danceTypeMap: Record<string, Record<string, string>> = {
    bachata: { en: 'Bachata', ko: '바차타' },
    chaChaCha: { en: 'Cha Cha Cha', ko: '차차차' },
    foxtrot: { en: 'Foxtrot', ko: '폭스트롯' },
    jive: { en: 'Jive', ko: '자이브' },
    merengue: { en: 'Merengue', ko: '메렝게' },
    pasoDoble: { en: 'Paso Doble', ko: '파소도블레' },
    quickstep: { en: 'Quickstep', ko: '퀵스텝' },
    rumba: { en: 'Rumba', ko: '룸바' },
    salsa: { en: 'Salsa', ko: '살사' },
    samba: { en: 'Samba', ko: '삼바' },
    tango: { en: 'Tango', ko: '탱고' },
    waltz: { en: 'Waltz', ko: '왈츠' },
  }

  return danceTypeMap[danceType]?.[locale] || danceType
}

/**
 * 상태를 현재 locale에 맞게 번역합니다
 */
export function getStatusName(status: string, locale: string = 'ko'): string {
  const statusMap: Record<string, Record<string, string>> = {
    approved: { en: 'Approved', ko: '승인됨' },
    pending: { en: 'Pending', ko: '대기중' },
    rejected: { en: 'Rejected', ko: '거부됨' },
  }

  return statusMap[status]?.[locale] || status
}

/**
 * 지원하는 locale 목록을 반환합니다
 */
export function getSupportedLocales(): string[] {
  return ['ko', 'en']
}

/**
 * 기본 locale을 반환합니다
 */
export function getDefaultLocale(): string {
  return 'ko'
}

/**
 * locale이 유효한지 확인합니다
 */
export function isValidLocale(locale: string): boolean {
  return getSupportedLocales().includes(locale)
}
