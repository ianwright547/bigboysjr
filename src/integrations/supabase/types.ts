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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      catalog_items: {
        Row: {
          active: boolean
          category: string
          created_at: string
          icon: string
          id: string
          name: string
          price: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          icon?: string
          id: string
          name: string
          price?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          icon?: string
          id?: string
          name?: string
          price?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      custom_item_requests: {
        Row: {
          assigned_price: number | null
          created_at: string
          description: string
          id: string
          name: string
          phone: string
          photo_urls: string[] | null
          quantity: number
          status: string
          zip_code: string | null
        }
        Insert: {
          assigned_price?: number | null
          created_at?: string
          description: string
          id?: string
          name: string
          phone: string
          photo_urls?: string[] | null
          quantity?: number
          status?: string
          zip_code?: string | null
        }
        Update: {
          assigned_price?: number | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          phone?: string
          photo_urls?: string[] | null
          quantity?: number
          status?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          add_ons: Json | null
          address: string | null
          booking_date: string | null
          created_at: string
          email: string | null
          geocoded_at: string | null
          id: string
          idempotency_key: string | null
          latitude: number | null
          load_size: Json | null
          longitude: number | null
          message: string | null
          name: string
          phone: string
          pricing_method: string | null
          request_type: string
          save_source: string
          selected_items: Json | null
          status: string
          time_slot: string | null
          total_price: number | null
          urgency: string | null
          zip_code: string | null
        }
        Insert: {
          add_ons?: Json | null
          address?: string | null
          booking_date?: string | null
          created_at?: string
          email?: string | null
          geocoded_at?: string | null
          id?: string
          idempotency_key?: string | null
          latitude?: number | null
          load_size?: Json | null
          longitude?: number | null
          message?: string | null
          name: string
          phone: string
          pricing_method?: string | null
          request_type: string
          save_source?: string
          selected_items?: Json | null
          status?: string
          time_slot?: string | null
          total_price?: number | null
          urgency?: string | null
          zip_code?: string | null
        }
        Update: {
          add_ons?: Json | null
          address?: string | null
          booking_date?: string | null
          created_at?: string
          email?: string | null
          geocoded_at?: string | null
          id?: string
          idempotency_key?: string | null
          latitude?: number | null
          load_size?: Json | null
          longitude?: number | null
          message?: string | null
          name?: string
          phone?: string
          pricing_method?: string | null
          request_type?: string
          save_source?: string
          selected_items?: Json | null
          status?: string
          time_slot?: string | null
          total_price?: number | null
          urgency?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      pageviews: {
        Row: {
          country: string | null
          created_at: string
          device: string | null
          id: number
          path: string
          referrer: string | null
          session_id: string
          source: string | null
          user_agent: string | null
          visitor_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          device?: string | null
          id?: number
          path: string
          referrer?: string | null
          session_id: string
          source?: string | null
          user_agent?: string | null
          visitor_id: string
        }
        Update: {
          country?: string | null
          created_at?: string
          device?: string | null
          id?: number
          path?: string
          referrer?: string | null
          session_id?: string
          source?: string | null
          user_agent?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      seo_overrides: {
        Row: {
          created_at: string
          description: string | null
          h1: string | null
          id: string
          keywords: string | null
          page_type: string
          path: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          h1?: string | null
          id?: string
          keywords?: string | null
          page_type?: string
          path: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          h1?: string | null
          id?: string
          keywords?: string | null
          page_type?: string
          path?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_analytics: {
        Row: {
          avg_pages_per_visit: number
          avg_session_duration: number
          bounce_rate: number
          devices: Json
          id: number
          pageviews_daily: Json
          pageviews_total: number
          sources: Json
          top_pages: Json
          updated_at: string
          visitors_daily: Json
          visitors_total: number
        }
        Insert: {
          avg_pages_per_visit?: number
          avg_session_duration?: number
          bounce_rate?: number
          devices?: Json
          id?: number
          pageviews_daily?: Json
          pageviews_total?: number
          sources?: Json
          top_pages?: Json
          updated_at?: string
          visitors_daily?: Json
          visitors_total?: number
        }
        Update: {
          avg_pages_per_visit?: number
          avg_session_duration?: number
          bounce_rate?: number
          devices?: Json
          id?: number
          pageviews_daily?: Json
          pageviews_total?: number
          sources?: Json
          top_pages?: Json
          updated_at?: string
          visitors_daily?: Json
          visitors_total?: number
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      web_vitals: {
        Row: {
          created_at: string
          id: string
          name: string
          navigation_type: string | null
          path: string
          rating: string | null
          session_id: string | null
          user_agent: string | null
          value: number
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          navigation_type?: string | null
          path: string
          rating?: string | null
          session_id?: string | null
          user_agent?: string | null
          value: number
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          navigation_type?: string | null
          path?: string
          rating?: string | null
          session_id?: string | null
          user_agent?: string | null
          value?: number
          visitor_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
