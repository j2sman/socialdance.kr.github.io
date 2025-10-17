export default defineEventHandler(async event => {
  try {
    const supabase = useSupabaseClient()
    const query = getQuery(event)
    const locale = (query.locale as string) || 'ko'

    const { data, error } = await supabase
      .from('clubs')
      .select(
        `
        *,
        social_links(*),
        images(*)
      `
      )
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch clubs',
      })
    }

    // locale에 따라 적절한 필드 반환
    const processedData =
      data?.map(club => ({
        ...club,
        display_description:
          locale === 'en' && club.description_en ? club.description_en : club.description,
        display_name: locale === 'en' && club.name_en ? club.name_en : club.name,
      })) || []

    return {
      data: processedData,
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
