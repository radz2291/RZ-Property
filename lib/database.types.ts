export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      site_content: {
        Row: {
          id: string
          section: string
          title: string
          description: string | null
          background_image: string | null
          data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section: string
          title: string
          description?: string | null
          background_image?: string | null
          data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section?: string
          title?: string
          description?: string | null
          background_image?: string | null
          data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          name: string
          photo: string | null
          bio: string
          phone_number: string
          whatsapp_number: string
          email: string | null
          years_of_experience: number
          specialties: string[]
          username: string | null
          password_hash: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          photo?: string | null
          bio: string
          phone_number: string
          whatsapp_number: string
          email?: string | null
          years_of_experience: number
          specialties: string[]
          username?: string | null
          password_hash?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          photo?: string | null
          bio?: string
          phone_number?: string
          whatsapp_number?: string
          email?: string | null
          years_of_experience?: number
          specialties?: string[]
          username?: string | null
          password_hash?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string
          additional_details: string | null
          price: number
          category: "For Sale" | "For Rent"
          property_type: "Residential" | "Commercial" | "Land"
          status: "Available" | "Pending" | "Sold" | "Rented"
          size: number
          bedrooms: number
          bathrooms: number
          address: string
          district: string
          city: string
          state: string
          country: string
          featured_image: string | null
          images: string[]
          has_parking: boolean
          has_furnished: boolean
          has_air_con: boolean
          has_balcony: boolean | null
          has_garden: boolean | null
          created_at: string
          updated_at: string
          view_count: number
          agent_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          additional_details?: string | null
          price: number
          category: "For Sale" | "For Rent"
          property_type: "Residential" | "Commercial" | "Land"
          status: "Available" | "Pending" | "Sold" | "Rented"
          size: number
          bedrooms: number
          bathrooms: number
          address: string
          district: string
          city: string
          state: string
          country: string
          featured_image?: string | null
          images: string[]
          has_parking: boolean
          has_furnished: boolean
          has_air_con: boolean
          has_balcony?: boolean | null
          has_garden?: boolean | null
          created_at?: string
          updated_at?: string
          view_count?: number
          agent_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          additional_details?: string | null
          price?: number
          category?: "For Sale" | "For Rent"
          property_type?: "Residential" | "Commercial" | "Land"
          status?: "Available" | "Pending" | "Sold" | "Rented"
          size?: number
          bedrooms?: number
          bathrooms?: number
          address?: string
          district?: string
          city?: string
          state?: string
          country?: string
          featured_image?: string | null
          images?: string[]
          has_parking?: boolean
          has_furnished?: boolean
          has_air_con?: boolean
          has_balcony?: boolean | null
          has_garden?: boolean | null
          created_at?: string
          updated_at?: string
          view_count?: number
          agent_id?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          name: string
          phone_number: string
          email: string | null
          message: string
          status: "New" | "Contacted" | "Closed"
          property_id: string
          created_at: string
          updated_at: string
          source: "contact_form" | "whatsapp"
        }
        Insert: {
          id?: string
          name: string
          phone_number: string
          email?: string | null
          message: string
          status?: "New" | "Contacted" | "Closed"
          property_id: string
          created_at?: string
          updated_at?: string
          source?: "contact_form" | "whatsapp"
        }
        Update: {
          id?: string
          name?: string
          phone_number?: string
          email?: string | null
          message?: string
          status?: "New" | "Contacted" | "Closed"
          property_id?: string
          created_at?: string
          updated_at?: string
          source?: "contact_form" | "whatsapp"
        }
      }
      page_views: {
        Row: {
          id: string
          page: string
          referrer: string | null
          user_agent: string | null
          ip_address: string | null
          property_id: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          page: string
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          property_id?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          page?: string
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          property_id?: string | null
          timestamp?: string
        }
      }
      seo_metadata: {
        Row: {
          id: string
          path: string
          title: string
          description: string
          keywords: string[]
          og_image: string | null
          property_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          path: string
          title: string
          description: string
          keywords: string[]
          og_image?: string | null
          property_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          path?: string
          title?: string
          description?: string
          keywords?: string[]
          og_image?: string | null
          property_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
