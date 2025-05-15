export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      plants: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          image_url: string;
          watering_interval: number; // in days
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          image_url: string;
          watering_interval: number;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          image_url?: string;
          watering_interval?: number;
          user_id?: string;
        };
      };
      watering_events: {
        Row: {
          id: string;
          plant_id: string;
          water_amount: number; // in cups
          watered_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          plant_id: string;
          water_amount: number;
          watered_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          plant_id?: string;
          water_amount?: number;
          watered_at?: string;
          user_id?: string;
        };
      };
    };
  };
}

// Aquí definimos el tipo Plant para usar en el frontend
export type Plant = Database['public']['Tables']['plants']['Row'] & {
  watering_events?: Database['public']['Tables']['watering_events']['Row'][];
  needsWater?: boolean;
};