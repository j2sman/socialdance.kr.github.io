export default defineEventHandler(async event => {
  try {
    const supabase = useSupabaseClient()
    const query = getQuery(event)
    const locale = (query.locale as string) || 'ko'

    const { data, error } = await supabase
      .from('latin_bars')
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
        statusMessage: 'Failed to fetch latin bars',
      })
    }

    // locale에 따라 적절한 필드 반환
    const processedData =
      data?.map(bar => ({
        ...bar,
        display_address: locale === 'en' && bar.address_en ? bar.address_en : bar.address,
        display_description:
          locale === 'en' && bar.description_en ? bar.description_en : bar.description,
        display_name: locale === 'en' && bar.name_en ? bar.name_en : bar.name,
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
