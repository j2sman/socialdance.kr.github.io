export const useLatinBars = () => {
  const supabase = useSupabaseClient()

  const getLatinBars = async (): Promise<LatinBar[]> => {
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

    if (error) throw error
    return data || []
  }

  const getLatinBar = async (id: string): Promise<LatinBar | null> => {
    const { data, error } = await supabase
      .from('latin_bars')
      .select(
        `
        *,
        social_links(*),
        images(*)
      `
      )
      .eq('id', id)
      .eq('status', 'approved')
      .single()

    if (error) return null
    return data
  }

  const createLatinBar = async (barData: LatinBarFormData): Promise<LatinBar> => {
    const { data, error } = await supabase
      .from('latin_bars')
      .insert({
        address: barData.address,
        latitude: barData.latitude,
        longitude: barData.longitude,
        map_provider: barData.map_provider,
        name: barData.name,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  const requestLatinBarUpdate = async (id: string, updateData: LatinBarFormData): Promise<void> => {
    const { error } = await supabase.from('update_requests').insert({
      entity_id: id,
      entity_type: 'latin_bar',
      request_data: updateData,
      status: 'pending',
    })

    if (error) throw error
  }

  return {
    createLatinBar,
    getLatinBar,
    getLatinBars,
    requestLatinBarUpdate,
  }
}
