export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    CompositeTypes: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    Functions: {
      verify_admin: {
        Args: {
          p_email: string
          p_password: string
        }
        Returns: boolean
      }
    }
    Tables: {
      admins: {
        Insert: {
          created_at?: string
          email: string
          id?: string
          password: string
          updated_at?: string
        }
        Relationships: []
        Row: {
          created_at: string
          email: string
          id: string
          password: string
          updated_at: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password?: string
          updated_at?: string
        }
      }
      clubs: {
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          dance_types?: string[] | null
          description?: string | null
          description_en?: string | null
          google_calendar_id?: string | null
          id?: string
          name: string
          name_en?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            columns: ['approved_by']
            foreignKeyName: 'clubs_approved_by_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'admins'
          },
        ]
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          dance_types: string[] | null
          description: string | null
          description_en: string | null
          google_calendar_id: string | null
          id: string
          name: string
          name_en: string | null
          status: string
          updated_at: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          dance_types?: string[] | null
          description?: string | null
          description_en?: string | null
          google_calendar_id?: string | null
          id?: string
          name?: string
          name_en?: string | null
          status?: string
          updated_at?: string
        }
      }
      images: {
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          file_data?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          order_index?: number
        }
        Relationships: []
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          file_data: string | null
          file_name: string
          file_size: number | null
          id: string
          mime_type: string | null
          order_index: number
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          file_data?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          order_index?: number
        }
      }
      latin_bars: {
        Insert: {
          address: string
          address_en?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          map_provider?: string | null
          name: string
          name_en?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            columns: ['approved_by']
            foreignKeyName: 'latin_bars_approved_by_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'admins'
          },
        ]
        Row: {
          address: string
          address_en: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          description: string | null
          description_en: string | null
          id: string
          latitude: number | null
          longitude: number | null
          map_provider: string | null
          name: string
          name_en: string | null
          status: string
          updated_at: string
        }
        Update: {
          address?: string
          address_en?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          map_provider?: string | null
          name?: string
          name_en?: string | null
          status?: string
          updated_at?: string
        }
      }
      site_settings: {
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Relationships: []
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
      }
      social_links: {
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          password?: string | null
          platform: string
          url: string
        }
        Relationships: []
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          password: string | null
          platform: string
          url: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          password?: string | null
          platform?: string
          url?: string
        }
      }
      update_requests: {
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          request_data: Json
          requested_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            columns: ['approved_by']
            foreignKeyName: 'update_requests_approved_by_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'admins'
          },
        ]
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          request_data: Json
          requested_by: string | null
          status: string
          updated_at: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          request_data?: Json
          requested_by?: string | null
          status?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
  }
}
