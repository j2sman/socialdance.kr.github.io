import type { Club, ClubFormData, UpdateRequest } from '~/types'

export const useClubs = () => {
  const supabase = useSupabaseClient()

  const getClubs = async (): Promise<Club[]> => {
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

    if (error) throw error
    return data as unknown as Club[]
  }

  const getClub = async (id: string): Promise<Club | null> => {
    const { data, error } = await supabase
      .from('clubs')
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
    return data as unknown as Club
  }

  const createClub = async (clubData: ClubFormData): Promise<Club> => {
    const { data, error } = await supabase
      .from('clubs')
      .insert({
        dance_types: clubData.dance_types,
        google_calendar_id: clubData.google_calendar_id,
        name: clubData.name,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error
    return data as unknown as Club
  }

  const requestClubUpdate = async (id: string, updateData: ClubFormData): Promise<void> => {
    const { error } = await supabase.from('update_requests').insert<UpdateRequest>({
      created_at: new Date().toISOString(),
      entity_id: id,
      entity_type: 'club',
      id: crypto.randomUUID(),
      request_data: JSON.stringify(updateData),
      status: 'pending',
      updated_at: new Date().toISOString(),
    })

    if (error) throw error
  }

  return {
    createClub,
    getClub,
    getClubs,
    requestClubUpdate,
  }
}
