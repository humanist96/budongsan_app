export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      celebrities: {
        Row: {
          id: string
          name: string
          category: 'entertainer' | 'politician' | 'athlete' | 'expert'
          sub_category: string | null
          profile_image_url: string | null
          description: string | null
          property_count: number
          total_asset_value: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'entertainer' | 'politician' | 'athlete' | 'expert'
          sub_category?: string | null
          profile_image_url?: string | null
          description?: string | null
          property_count?: number
          total_asset_value?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'entertainer' | 'politician' | 'athlete' | 'expert'
          sub_category?: string | null
          profile_image_url?: string | null
          description?: string | null
          property_count?: number
          total_asset_value?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'celebrity_properties_celebrity_id_fkey'
            columns: ['id']
            isOneToOne: false
            referencedRelation: 'celebrity_properties'
            referencedColumns: ['celebrity_id']
          },
        ]
      }
      properties: {
        Row: {
          id: string
          name: string
          address: string
          latitude: number
          longitude: number
          property_type: 'apartment' | 'house' | 'villa' | 'officetel' | 'building' | 'land' | 'other'
          exclusive_area: number | null
          floor_info: string | null
          building_year: number | null
          dong_code: string | null
          latest_transaction_price: number | null
          latest_transaction_date: string | null
          comment_count: number
          like_count: number
          checkin_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          latitude: number
          longitude: number
          property_type: 'apartment' | 'house' | 'villa' | 'officetel' | 'building' | 'land' | 'other'
          exclusive_area?: number | null
          floor_info?: string | null
          building_year?: number | null
          dong_code?: string | null
          latest_transaction_price?: number | null
          latest_transaction_date?: string | null
          comment_count?: number
          like_count?: number
          checkin_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          latitude?: number
          longitude?: number
          property_type?: 'apartment' | 'house' | 'villa' | 'officetel' | 'building' | 'land' | 'other'
          exclusive_area?: number | null
          floor_info?: string | null
          building_year?: number | null
          dong_code?: string | null
          latest_transaction_price?: number | null
          latest_transaction_date?: string | null
          comment_count?: number
          like_count?: number
          checkin_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      celebrity_properties: {
        Row: {
          id: string
          celebrity_id: string
          property_id: string
          ownership_type: 'owner' | 'tenant' | 'former_owner'
          acquisition_date: string | null
          acquisition_price: number | null
          source_url: string | null
          verification_status: 'verified' | 'reported' | 'unverified'
          created_at: string
        }
        Insert: {
          id?: string
          celebrity_id: string
          property_id: string
          ownership_type?: 'owner' | 'tenant' | 'former_owner'
          acquisition_date?: string | null
          acquisition_price?: number | null
          source_url?: string | null
          verification_status?: 'verified' | 'reported' | 'unverified'
          created_at?: string
        }
        Update: {
          id?: string
          celebrity_id?: string
          property_id?: string
          ownership_type?: 'owner' | 'tenant' | 'former_owner'
          acquisition_date?: string | null
          acquisition_price?: number | null
          source_url?: string | null
          verification_status?: 'verified' | 'reported' | 'unverified'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'celebrity_properties_celebrity_id_fkey'
            columns: ['celebrity_id']
            isOneToOne: false
            referencedRelation: 'celebrities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'celebrity_properties_property_id_fkey'
            columns: ['property_id']
            isOneToOne: false
            referencedRelation: 'properties'
            referencedColumns: ['id']
          },
        ]
      }
      transactions: {
        Row: {
          id: string
          property_id: string
          transaction_amount: number
          transaction_year: number
          transaction_month: number
          transaction_day: number
          exclusive_area: number | null
          floor: number | null
          raw_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          transaction_amount: number
          transaction_year: number
          transaction_month: number
          transaction_day: number
          exclusive_area?: number | null
          floor?: number | null
          raw_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          transaction_amount?: number
          transaction_year?: number
          transaction_month?: number
          transaction_day?: number
          exclusive_area?: number | null
          floor?: number | null
          raw_data?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'transactions_property_id_fkey'
            columns: ['property_id']
            isOneToOne: false
            referencedRelation: 'properties'
            referencedColumns: ['id']
          },
        ]
      }
      comments: {
        Row: {
          id: string
          user_id: string
          property_id: string
          parent_id: string | null
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          parent_id?: string | null
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          parent_id?: string | null
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'comments_property_id_fkey'
            columns: ['property_id']
            isOneToOne: false
            referencedRelation: 'properties'
            referencedColumns: ['id']
          },
        ]
      }
      likes: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'likes_property_id_fkey'
            columns: ['property_id']
            isOneToOne: false
            referencedRelation: 'properties'
            referencedColumns: ['id']
          },
        ]
      }
      checkins: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'checkins_property_id_fkey'
            columns: ['property_id']
            isOneToOne: false
            referencedRelation: 'properties'
            referencedColumns: ['id']
          },
        ]
      }
      user_submissions: {
        Row: {
          id: string
          user_id: string | null
          celebrity_name: string
          property_address: string
          description: string | null
          source_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          celebrity_name: string
          property_address: string
          description?: string | null
          source_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          celebrity_name?: string
          property_address?: string
          description?: string | null
          source_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          reviewed_at?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          score: number
          total_questions: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          total_questions: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          total_questions?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_multi_owner_celebrities: {
        Row: {
          id: string
          name: string
          category: 'entertainer' | 'politician' | 'athlete' | 'expert'
          property_count: number
          total_asset_value: number
          profile_image_url: string | null
        }
        Relationships: []
      }
      v_neighborhood_density: {
        Row: {
          dong_code: string
          address_prefix: string
          celebrity_count: number
          property_count: number
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
