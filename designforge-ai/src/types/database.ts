export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          plan: "free" | "pro" | "business";
          email_verified: boolean;
          ai_generations_today: number;
          last_generation_date: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          plan?: "free" | "pro" | "business";
          email_verified?: boolean;
          ai_generations_today?: number;
          last_generation_date?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          plan?: "free" | "pro" | "business";
          email_verified?: boolean;
          ai_generations_today?: number;
          last_generation_date?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          type: string;
          thumbnail_url: string | null;
          width: number;
          height: number;
          elements: Json;
          ai_generated: boolean;
          template_id: string | null;
          folder_id: string | null;
          status: string;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          type: string;
          thumbnail_url?: string | null;
          width: number;
          height: number;
          elements?: Json;
          ai_generated?: boolean;
          template_id?: string | null;
          folder_id?: string | null;
          status?: string;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          type?: string;
          thumbnail_url?: string | null;
          width?: number;
          height?: number;
          elements?: Json;
          ai_generated?: boolean;
          template_id?: string | null;
          folder_id?: string | null;
          status?: string;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string;
          subcategory: string | null;
          type: string;
          thumbnail_url: string;
          preview_url: string | null;
          width: number;
          height: number;
          elements: Json;
          tags: string[];
          premium: boolean;
          popular: boolean;
          downloads: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: string;
          subcategory?: string | null;
          type: string;
          thumbnail_url: string;
          preview_url?: string | null;
          width: number;
          height: number;
          elements?: Json;
          tags?: string[];
          premium?: boolean;
          popular?: boolean;
          downloads?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          subcategory?: string | null;
          type?: string;
          thumbnail_url?: string;
          preview_url?: string | null;
          width?: number;
          height?: number;
          elements?: Json;
          tags?: string[];
          premium?: boolean;
          popular?: boolean;
          downloads?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_generations: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          prompt: string;
          result: Json;
          model: string;
          tokens_used: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          prompt: string;
          result: Json;
          model: string;
          tokens_used: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          prompt?: string;
          result?: Json;
          model?: string;
          tokens_used?: number;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          status: string;
          stripe_subscription_id: string | null;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: string;
          status: string;
          stripe_subscription_id?: string | null;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: string;
          status?: string;
          stripe_subscription_id?: string | null;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
        };
      };
      invitations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          event_type: string;
          event_name: string;
          event_date: string;
          event_time: string | null;
          venue: string | null;
          theme: string | null;
          color_palette: Json;
          style_preference: string | null;
          custom_instructions: string | null;
          project_id: string | null;
          rsvp_enabled: boolean;
          qr_enabled: boolean;
          share_link: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          event_type: string;
          event_name: string;
          event_date: string;
          event_time?: string | null;
          venue?: string | null;
          theme?: string | null;
          color_palette?: Json;
          style_preference?: string | null;
          custom_instructions?: string | null;
          project_id?: string | null;
          rsvp_enabled?: boolean;
          qr_enabled?: boolean;
          share_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          event_type?: string;
          event_name?: string;
          event_date?: string;
          event_time?: string | null;
          venue?: string | null;
          theme?: string | null;
          color_palette?: Json;
          style_preference?: string | null;
          custom_instructions?: string | null;
          project_id?: string | null;
          rsvp_enabled?: boolean;
          qr_enabled?: boolean;
          share_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rsvp_responses: {
        Row: {
          id: string;
          invitation_id: string;
          guest_name: string;
          guest_email: string | null;
          status: string;
          guests_count: number;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          guest_name: string;
          guest_email?: string | null;
          status: string;
          guests_count?: number;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          invitation_id?: string;
          guest_name?: string;
          guest_email?: string | null;
          status?: string;
          guests_count?: number;
          message?: string | null;
          created_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          created_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          role?: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
          role?: string;
          joined_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read: boolean;
          data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read?: boolean;
          data?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          read?: boolean;
          data?: Json;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          currency: string;
          status: string;
          payment_method: string;
          payment_intent_id: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          currency: string;
          status: string;
          payment_method: string;
          payment_intent_id: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          payment_method?: string;
          payment_intent_id?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          date: string;
          total_users: number;
          new_users: number;
          active_users: number;
          total_projects: number;
          ai_generations: number;
          downloads: number;
          revenue: number;
          conversions: number;
        };
        Insert: {
          id?: string;
          date: string;
          total_users?: number;
          new_users?: number;
          active_users?: number;
          total_projects?: number;
          ai_generations?: number;
          downloads?: number;
          revenue?: number;
          conversions?: number;
        };
        Update: {
          id?: string;
          date?: string;
          total_users?: number;
          new_users?: number;
          active_users?: number;
          total_projects?: number;
          ai_generations?: number;
          downloads?: number;
          revenue?: number;
          conversions?: number;
        };
      };
      folders: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          parent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          parent_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          parent_id?: string | null;
          created_at?: string;
        };
      };
      downloads: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          format: string;
          file_url: string;
          file_size: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          format: string;
          file_url: string;
          file_size: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          format?: string;
          file_url?: string;
          file_size?: number;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
