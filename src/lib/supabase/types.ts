export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          description: string;
          id: string;
          key: string;
          sort_order: number;
          title: string;
        };
        Insert: {
          description: string;
          id?: string;
          key: string;
          sort_order?: number;
          title: string;
        };
        Update: {
          description?: string;
          id?: string;
          key?: string;
          sort_order?: number;
          title?: string;
        };
        Relationships: [];
      };
      daily_pools: {
        Row: {
          created_at: string;
          match_day: string;
          match_ids: string[];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          match_day: string;
          match_ids: string[];
          user_id: string;
        };
        Update: {
          created_at?: string;
          match_day?: string;
          match_ids?: string[];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_pools_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      matches: {
        Row: {
          away_odds: number;
          away_score: number | null;
          away_team: string;
          created_at: string;
          external_id: string | null;
          home_odds: number;
          home_score: number | null;
          home_team: string;
          id: string;
          kickoff: string;
          league: string;
          result: Database["public"]["Enums"]["match_result"] | null;
          status: Database["public"]["Enums"]["match_status"];
        };
        Insert: {
          away_odds: number;
          away_score?: number | null;
          away_team: string;
          created_at?: string;
          external_id?: string | null;
          home_odds: number;
          home_score?: number | null;
          home_team: string;
          id?: string;
          kickoff: string;
          league: string;
          result?: Database["public"]["Enums"]["match_result"] | null;
          status?: Database["public"]["Enums"]["match_status"];
        };
        Update: {
          away_odds?: number;
          away_score?: number | null;
          away_team?: string;
          created_at?: string;
          external_id?: string | null;
          home_odds?: number;
          home_score?: number | null;
          home_team?: string;
          id?: string;
          kickoff?: string;
          league?: string;
          result?: Database["public"]["Enums"]["match_result"] | null;
          status?: Database["public"]["Enums"]["match_status"];
        };
        Relationships: [];
      };
      picks: {
        Row: {
          cost: number;
          created_at: string;
          id: string;
          match_day: string;
          match_id: string | null;
          picked_side: Database["public"]["Enums"]["match_result"] | null;
          result: Database["public"]["Enums"]["pick_result"] | null;
          settled_at: string | null;
          user_id: string;
        };
        Insert: {
          cost?: number;
          created_at?: string;
          id?: string;
          match_day: string;
          match_id?: string | null;
          picked_side?: Database["public"]["Enums"]["match_result"] | null;
          result?: Database["public"]["Enums"]["pick_result"] | null;
          settled_at?: string | null;
          user_id: string;
        };
        Update: {
          cost?: number;
          created_at?: string;
          id?: string;
          match_day?: string;
          match_id?: string | null;
          picked_side?: Database["public"]["Enums"]["match_result"] | null;
          result?: Database["public"]["Enums"]["pick_result"] | null;
          settled_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "picks_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "picks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          balance: number;
          created_at: string;
          id: string;
          last_income_on: string | null;
          trophies: number;
          updated_at: string;
          username: string;
          win_streak: number;
        };
        Insert: {
          balance?: number;
          created_at?: string;
          id: string;
          last_income_on?: string | null;
          trophies?: number;
          updated_at?: string;
          username: string;
          win_streak?: number;
        };
        Update: {
          balance?: number;
          created_at?: string;
          id?: string;
          last_income_on?: string | null;
          trophies?: number;
          updated_at?: string;
          username?: string;
          win_streak?: number;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          achievement_id: string;
          earned_at: string;
          user_id: string;
        };
        Insert: {
          achievement_id: string;
          earned_at?: string;
          user_id: string;
        };
        Update: {
          achievement_id?: string;
          earned_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey";
            columns: ["achievement_id"];
            isOneToOne: false;
            referencedRelation: "achievements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      apply_daily_income: {
        Args: Record<string, never>;
        Returns: number;
      };
      generate_default_picks: {
        Args: Record<string, never>;
        Returns: number;
      };
      set_daily_pick: {
        Args: {
          p_match_id: string | null;
          p_side: Database["public"]["Enums"]["match_result"] | null;
        };
        Returns: number;
      };
    };
    Enums: {
      match_result: "home" | "draw" | "away";
      match_status: "scheduled" | "finished";
      pick_result: "win" | "draw" | "loss" | "none";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      match_result: ["home", "draw", "away"],
      match_status: ["scheduled", "finished"],
      pick_result: ["win", "draw", "loss", "none"],
    },
  },
} as const;
