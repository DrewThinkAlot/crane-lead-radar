export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      commercial_buildings: {
        Row: {
          address: string
          building_age: number
          city: string
          created_at: string
          estimated_warranty_expiration: string
          id: string
          is_sample_record: boolean | null
          last_roof_permit_date: string
          notes: string | null
          owner_email: string | null
          owner_phone: string
          property_management_company: string | null
          property_name: string
          property_owner_name: string
          property_type: string
          square_footage: number
          year_built: number
          zip_code: string
        }
        Insert: {
          address: string
          building_age: number
          city?: string
          created_at?: string
          estimated_warranty_expiration: string
          id?: string
          is_sample_record?: boolean | null
          last_roof_permit_date: string
          notes?: string | null
          owner_email?: string | null
          owner_phone: string
          property_management_company?: string | null
          property_name: string
          property_owner_name: string
          property_type: string
          square_footage: number
          year_built: number
          zip_code: string
        }
        Update: {
          address?: string
          building_age?: number
          city?: string
          created_at?: string
          estimated_warranty_expiration?: string
          id?: string
          is_sample_record?: boolean | null
          last_roof_permit_date?: string
          notes?: string | null
          owner_email?: string | null
          owner_phone?: string
          property_management_company?: string | null
          property_name?: string
          property_owner_name?: string
          property_type?: string
          square_footage?: number
          year_built?: number
          zip_code?: string
        }
        Relationships: []
      }
      database_purchases: {
        Row: {
          amount_paid: number
          buyer_company: string
          buyer_email: string
          buyer_name: string
          buyer_phone: string
          can_repurchase_after: string | null
          created_at: string
          csv_delivered_at: string | null
          csv_download_url: string | null
          id: string
          payment_status: string
          purchase_date: string
          repurchase_notified: boolean | null
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount_paid: number
          buyer_company: string
          buyer_email: string
          buyer_name: string
          buyer_phone: string
          can_repurchase_after?: string | null
          created_at?: string
          csv_delivered_at?: string | null
          csv_download_url?: string | null
          id?: string
          payment_status?: string
          purchase_date?: string
          repurchase_notified?: boolean | null
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount_paid?: number
          buyer_company?: string
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string
          can_repurchase_after?: string | null
          created_at?: string
          csv_delivered_at?: string | null
          csv_download_url?: string | null
          id?: string
          payment_status?: string
          purchase_date?: string
          repurchase_notified?: boolean | null
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: []
      }
      free_lead_requests: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          lead_sent_at: string | null
          name: string
          status: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          lead_sent_at?: string | null
          name: string
          status?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          lead_sent_at?: string | null
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      next_release_waitlist: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      sample_views: {
        Row: {
          id: string
          ip_address: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          viewed_at?: string
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          name: string
          status: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
