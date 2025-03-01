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
      items: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          image_url: string
          points: number
          owner_id: string
          status: 'available' | 'claimed' | 'archived'
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          image_url: string
          points: number
          owner_id: string
          status?: 'available' | 'claimed' | 'archived'
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          image_url?: string
          points?: number
          owner_id?: string
          status?: 'available' | 'claimed' | 'archived'
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          user_id: string
          full_name: string
          role: 'admin' | 'user'
          points: number
          points_spent: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          full_name: string
          role?: 'admin' | 'user'
          points?: number
          points_spent?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          full_name?: string
          role?: 'admin' | 'user'
          points?: number
          points_spent?: number
        }
      }
      distributions: {
        Row: {
          id: string
          created_at: string
          name: string
          description?: string
          start_date: string
          end_date: string
          status: 'draft' | 'active' | 'completed'
          created_by: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string
          start_date: string
          end_date: string
          status?: 'draft' | 'active' | 'completed'
          created_by: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          start_date?: string
          end_date?: string
          status?: 'draft' | 'active' | 'completed'
          created_by?: string
        }
      }
      item_allocations: {
        Row: {
          id: string
          created_at: string
          item_id: string
          user_id: string
          distribution_id: string
          points_allocated: number
          status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          item_id: string
          user_id: string
          distribution_id: string
          points_allocated: number
          status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          id?: string
          created_at?: string
          item_id?: string
          user_id?: string
          distribution_id?: string
          points_allocated?: number
          status?: 'pending' | 'approved' | 'rejected'
        }
      }
    }
  }
}
