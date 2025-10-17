export default defineEventHandler(async event => {
  try {
    const supabase = useSupabaseClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'admin_openchat_url')
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch admin chat URL',
      })
    }

    return {
      data: data.value,
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
