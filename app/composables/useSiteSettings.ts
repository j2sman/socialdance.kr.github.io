export const useSiteSettings = () => {
  const supabase = useSupabaseClient()

  const getAdminChatUrl = async (): Promise<string> => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'admin_openchat_url')
      .single()

    if (error) throw error
    return data.value
  }

  const updateAdminChatUrl = async (url: string): Promise<void> => {
    const { error } = await supabase
      .from('site_settings')
      .update({
        updated_at: new Date().toISOString(),
        value: url,
      })
      .eq('key', 'admin_openchat_url')

    if (error) throw error
  }

  return {
    getAdminChatUrl,
    updateAdminChatUrl,
  }
}
