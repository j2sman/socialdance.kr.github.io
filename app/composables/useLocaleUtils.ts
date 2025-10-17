import {
  getClubName,
  getClubDescription,
  getBarName,
  getBarAddress,
  getBarDescription,
  getDanceTypeName,
  getStatusName,
} from '~/utils/locale'

export const useLocaleUtils = () => {
  const { locale } = useI18n()

  return {
    getBarAddress: (bar: any) => getBarAddress(bar, locale.value),
    getBarDescription: (bar: any) => getBarDescription(bar, locale.value),
    getBarName: (bar: any) => getBarName(bar, locale.value),
    getClubDescription: (club: any) => getClubDescription(club, locale.value),
    getClubName: (club: any) => getClubName(club, locale.value),
    getDanceTypeName: (danceType: string) => getDanceTypeName(danceType, locale.value),
    getStatusName: (status: string) => getStatusName(status, locale.value),
  }
}
