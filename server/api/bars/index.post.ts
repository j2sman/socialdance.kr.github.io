export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)
    const supabase = useSupabaseClient()

    // 라틴바 기본 정보 저장
    const { data: bar, error: barError } = await supabase
      .from('latin_bars')
      .insert({
        address: body.address,
        address_en: body.address_en,
        description: body.description,
        description_en: body.description_en,
        latitude: body.latitude,
        longitude: body.longitude,
        map_provider: body.map_provider,
        name: body.name,
        name_en: body.name_en,
        status: 'pending',
      })
      .select()
      .single()

    if (barError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Failed to create latin bar',
      })
    }

    // 소셜 링크 저장
    if (body.social_links && body.social_links.length > 0) {
      const socialLinks = body.social_links.map((link: any) => ({
        entity_id: bar.id,
        entity_type: 'latin_bar',
        password: link.password,
        platform: link.platform,
        url: link.url,
      }))

      const { error: linksError } = await supabase.from('social_links').insert(socialLinks)

      if (linksError) {
        console.error('Failed to save social links:', linksError)
      }
    }

    return {
      data: bar,
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
