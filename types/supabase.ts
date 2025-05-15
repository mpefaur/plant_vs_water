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
      plants: {
        Row: {
          id: string
          created_at: string
          name: string
          image_url: string
          watering_interval: number // in days
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          image_url: string
          watering_interval: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          image_url?: string
          watering_interval?: number
          user_id?: string
        }
      }
      watering_events: {
        Row: {
          id: string
          plant_id: string
          water_amount: number // in cups
          watered_at: string
          user_id: string
        }
        Insert: {
          id?: string
          plant_id: string
          water_amount: number
          watered_at?: string
          user_id: string
        }
        Update: {
          id?: string
          plant_id?: string
          water_amount?: number
          watered_at?: string
          user_id?: string
        }
      }
    }
  }
}