export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)
    const supabase = useSupabaseClient()

    // 동호회 기본 정보 저장
    const { data: club, error: clubError } = await supabase
      .from('clubs')
      .insert({
        dance_types: body.dance_types || [],
        description: body.description,
        description_en: body.description_en,
        google_calendar_id: body.google_calendar_id,
        name: body.name,
        name_en: body.name_en,
        status: 'pending',
      })
      .select()
      .single()

    if (clubError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Failed to create club',
      })
    }

    // 소셜 링크 저장
    if (body.social_links && body.social_links.length > 0) {
      const socialLinks = body.social_links.map((link: any) => ({
        entity_id: club.id,
        entity_type: 'club',
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
      data: club,
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
