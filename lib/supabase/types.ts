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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ability_scores: {
        Row: {
          character_id: string
          charisma: number
          constitution: number
          dexterity: number
          intelligence: number
          strength: number
          wisdom: number
        }
        Insert: {
          character_id: string
          charisma: number
          constitution: number
          dexterity: number
          intelligence: number
          strength: number
          wisdom: number
        }
        Update: {
          character_id?: string
          charisma?: number
          constitution?: number
          dexterity?: number
          intelligence?: number
          strength?: number
          wisdom?: number
        }
        Relationships: [
          {
            foreignKeyName: "ability_scores_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      backgrounds: {
        Row: {
          description: string | null
          equipment: string[] | null
          feature: Json | null
          id: number
          languages: number | null
          name: string
          skill_proficiencies: string[] | null
          tool_proficiencies: string[] | null
        }
        Insert: {
          description?: string | null
          equipment?: string[] | null
          feature?: Json | null
          id?: number
          languages?: number | null
          name: string
          skill_proficiencies?: string[] | null
          tool_proficiencies?: string[] | null
        }
        Update: {
          description?: string | null
          equipment?: string[] | null
          feature?: Json | null
          id?: number
          languages?: number | null
          name?: string
          skill_proficiencies?: string[] | null
          tool_proficiencies?: string[] | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          dungeon_master: string | null
          dungeon_master_id: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          dungeon_master?: string | null
          dungeon_master_id?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          dungeon_master?: string | null
          dungeon_master_id?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      characters: {
        Row: {
          alignment: string | null
          appearance: string | null
          background: string | null
          backstory: string | null
          bonds: string | null
          campaign_id: string | null
          class_id: number | null
          created_at: string | null
          experience: number | null
          flaws: string | null
          id: string
          ideals: string | null
          level: number | null
          name: string
          personality_traits: string | null
          player_name: string | null
          race_id: number | null
          subclass: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alignment?: string | null
          appearance?: string | null
          background?: string | null
          backstory?: string | null
          bonds?: string | null
          campaign_id?: string | null
          class_id?: number | null
          created_at?: string | null
          experience?: number | null
          flaws?: string | null
          id?: string
          ideals?: string | null
          level?: number | null
          name: string
          personality_traits?: string | null
          player_name?: string | null
          race_id?: number | null
          subclass?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alignment?: string | null
          appearance?: string | null
          background?: string | null
          backstory?: string | null
          bonds?: string | null
          campaign_id?: string | null
          class_id?: number | null
          created_at?: string | null
          experience?: number | null
          flaws?: string | null
          id?: string
          ideals?: string | null
          level?: number | null
          name?: string
          personality_traits?: string | null
          player_name?: string | null
          race_id?: number | null
          subclass?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_characters_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_characters_race"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          armor_proficiencies: string[] | null
          average_hp: number | null
          class_features: Json | null
          description: string | null
          equipment_choices: Json | null
          features: Json | null
          hit_die: string
          hit_points_description: Json | null
          id: number
          name: string
          primary_ability: string[] | null
          progression_table: Json | null
          saving_throws: string[] | null
          skill_choices: Json | null
          spellcasting: Json | null
          subclasses: Json | null
          tool_proficiencies: string[] | null
          weapon_proficiencies: string[] | null
        }
        Insert: {
          armor_proficiencies?: string[] | null
          average_hp?: number | null
          class_features?: Json | null
          description?: string | null
          equipment_choices?: Json | null
          features?: Json | null
          hit_die: string
          hit_points_description?: Json | null
          id?: number
          name: string
          primary_ability?: string[] | null
          progression_table?: Json | null
          saving_throws?: string[] | null
          skill_choices?: Json | null
          spellcasting?: Json | null
          subclasses?: Json | null
          tool_proficiencies?: string[] | null
          weapon_proficiencies?: string[] | null
        }
        Update: {
          armor_proficiencies?: string[] | null
          average_hp?: number | null
          class_features?: Json | null
          description?: string | null
          equipment_choices?: Json | null
          features?: Json | null
          hit_die?: string
          hit_points_description?: Json | null
          id?: number
          name?: string
          primary_ability?: string[] | null
          progression_table?: Json | null
          saving_throws?: string[] | null
          skill_choices?: Json | null
          spellcasting?: Json | null
          subclasses?: Json | null
          tool_proficiencies?: string[] | null
          weapon_proficiencies?: string[] | null
        }
        Relationships: []
      }
      combat_stats: {
        Row: {
          armor_class: number
          character_id: string
          current_hp: number
          death_failures: number | null
          death_successes: number | null
          hit_dice_total: number
          hit_dice_type: string
          hit_dice_used: number | null
          initiative_bonus: number | null
          inspiration: boolean | null
          max_hp: number
          speed: number
          temp_hp: number | null
        }
        Insert: {
          armor_class: number
          character_id: string
          current_hp: number
          death_failures?: number | null
          death_successes?: number | null
          hit_dice_total: number
          hit_dice_type: string
          hit_dice_used?: number | null
          initiative_bonus?: number | null
          inspiration?: boolean | null
          max_hp: number
          speed: number
          temp_hp?: number | null
        }
        Update: {
          armor_class?: number
          character_id?: string
          current_hp?: number
          death_failures?: number | null
          death_successes?: number | null
          hit_dice_total?: number
          hit_dice_type?: string
          hit_dice_used?: number | null
          initiative_bonus?: number | null
          inspiration?: boolean | null
          max_hp?: number
          speed?: number
          temp_hp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "combat_stats_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      currency: {
        Row: {
          character_id: string
          copper: number | null
          electrum: number | null
          gold: number | null
          platinum: number | null
          silver: number | null
        }
        Insert: {
          character_id: string
          copper?: number | null
          electrum?: number | null
          gold?: number | null
          platinum?: number | null
          silver?: number | null
        }
        Update: {
          character_id?: string
          copper?: number | null
          electrum?: number | null
          gold?: number | null
          platinum?: number | null
          silver?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "currency_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_presets: {
        Row: {
          choices: Json | null
          class_id: number | null
          created_at: string | null
          description: string | null
          id: number
          is_default: boolean | null
          items: Json
          name: string
        }
        Insert: {
          choices?: Json | null
          class_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_default?: boolean | null
          items: Json
          name: string
        }
        Update: {
          choices?: Json | null
          class_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_default?: boolean | null
          items?: Json
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_presets_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      feats: {
        Row: {
          asi: Json | null
          benefits: Json | null
          description: string | null
          id: number
          name: string
          prerequisites: Json | null
        }
        Insert: {
          asi?: Json | null
          benefits?: Json | null
          description?: string | null
          id?: number
          name: string
          prerequisites?: Json | null
        }
        Update: {
          asi?: Json | null
          benefits?: Json | null
          description?: string | null
          id?: number
          name?: string
          prerequisites?: Json | null
        }
        Relationships: []
      }
      features: {
        Row: {
          character_id: string | null
          description: string | null
          id: string
          level_taken: number | null
          name: string
          parent_feature_id: string | null
          refresh_on: string | null
          source: string | null
          uses_max: number | null
          uses_remaining: number | null
        }
        Insert: {
          character_id?: string | null
          description?: string | null
          id?: string
          level_taken?: number | null
          name: string
          parent_feature_id?: string | null
          refresh_on?: string | null
          source?: string | null
          uses_max?: number | null
          uses_remaining?: number | null
        }
        Update: {
          character_id?: string | null
          description?: string | null
          id?: string
          level_taken?: number | null
          name?: string
          parent_feature_id?: string | null
          refresh_on?: string | null
          source?: string | null
          uses_max?: number | null
          uses_remaining?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "features_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "features_parent_feature_id_fkey"
            columns: ["parent_feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          character_id: string | null
          currency: string | null
          description: string | null
          equipped: boolean | null
          id: string
          item_id: number | null
          name: string
          notes: string | null
          properties: Json | null
          quantity: number | null
          type: string | null
          value: number | null
          weight: number | null
        }
        Insert: {
          character_id?: string | null
          currency?: string | null
          description?: string | null
          equipped?: boolean | null
          id?: string
          item_id?: number | null
          name: string
          notes?: string | null
          properties?: Json | null
          quantity?: number | null
          type?: string | null
          value?: number | null
          weight?: number | null
        }
        Update: {
          character_id?: string | null
          currency?: string | null
          description?: string | null
          equipped?: boolean | null
          id?: string
          item_id?: number | null
          name?: string
          notes?: string | null
          properties?: Json | null
          quantity?: number | null
          type?: string | null
          value?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: number
          name: string
          properties: Json | null
          rarity: string | null
          requires_attunement: boolean | null
          type: string
          updated_at: string | null
          value: number
          weight: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: number
          name: string
          properties?: Json | null
          rarity?: string | null
          requires_attunement?: boolean | null
          type: string
          updated_at?: string | null
          value?: number
          weight?: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: number
          name?: string
          properties?: Json | null
          rarity?: string | null
          requires_attunement?: boolean | null
          type?: string
          updated_at?: string | null
          value?: number
          weight?: number
        }
        Relationships: []
      }
      notes: {
        Row: {
          category: string | null
          character_id: string | null
          content: string | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          character_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          character_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      prepared_spells: {
        Row: {
          character_id: string | null
          created_at: string | null
          id: string
          spell_id: number | null
        }
        Insert: {
          character_id?: string | null
          created_at?: string | null
          id?: string
          spell_id?: number | null
        }
        Update: {
          character_id?: string | null
          created_at?: string | null
          id?: string
          spell_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prepared_spells_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prepared_spells_spell_id_fkey"
            columns: ["spell_id"]
            isOneToOne: false
            referencedRelation: "spells"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      races: {
        Row: {
          ability_bonuses: Json
          darkvision: number | null
          description: string | null
          extra_language: number | null
          extra_skills: number | null
          hp_per_level: number | null
          id: number
          immunities: string[] | null
          languages: string[] | null
          name: string
          proficiencies: string[] | null
          resistances: string[] | null
          size: string | null
          speed: number
          subraces: Json | null
          tools: string[] | null
          traits: Json | null
        }
        Insert: {
          ability_bonuses: Json
          darkvision?: number | null
          description?: string | null
          extra_language?: number | null
          extra_skills?: number | null
          hp_per_level?: number | null
          id?: number
          immunities?: string[] | null
          languages?: string[] | null
          name: string
          proficiencies?: string[] | null
          resistances?: string[] | null
          size?: string | null
          speed: number
          subraces?: Json | null
          tools?: string[] | null
          traits?: Json | null
        }
        Update: {
          ability_bonuses?: Json
          darkvision?: number | null
          description?: string | null
          extra_language?: number | null
          extra_skills?: number | null
          hp_per_level?: number | null
          id?: number
          immunities?: string[] | null
          languages?: string[] | null
          name?: string
          proficiencies?: string[] | null
          resistances?: string[] | null
          size?: string | null
          speed?: number
          subraces?: Json | null
          tools?: string[] | null
          traits?: Json | null
        }
        Relationships: []
      }
      saving_throws: {
        Row: {
          ability: string
          character_id: string
          proficient: boolean | null
        }
        Insert: {
          ability: string
          character_id: string
          proficient?: boolean | null
        }
        Update: {
          ability?: string
          character_id?: string
          proficient?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "saving_throws_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_proficiencies: {
        Row: {
          character_id: string
          proficiency_type: string | null
          skill_id: number
        }
        Insert: {
          character_id: string
          proficiency_type?: string | null
          skill_id: number
        }
        Update: {
          character_id?: string
          proficiency_type?: string | null
          skill_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "skill_proficiencies_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_proficiencies_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          ability: string
          created_at: string | null
          description: string | null
          id: number
          name: string
          name_it: string
        }
        Insert: {
          ability: string
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          name_it: string
        }
        Update: {
          ability?: string
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          name_it?: string
        }
        Relationships: []
      }
      spell_slots: {
        Row: {
          character_id: string
          spell_level: number
          total_slots: number
          used_slots: number | null
        }
        Insert: {
          character_id: string
          spell_level: number
          total_slots: number
          used_slots?: number | null
        }
        Update: {
          character_id?: string
          spell_level?: number
          total_slots?: number
          used_slots?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spell_slots_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      spells: {
        Row: {
          at_higher_levels: string | null
          casting_time: string | null
          classes: string[] | null
          components: Json | null
          concentration: boolean | null
          description: string | null
          duration: string | null
          id: number
          level: number
          name: string
          range: string | null
          ritual: boolean | null
          school: string
        }
        Insert: {
          at_higher_levels?: string | null
          casting_time?: string | null
          classes?: string[] | null
          components?: Json | null
          concentration?: boolean | null
          description?: string | null
          duration?: string | null
          id?: number
          level: number
          name: string
          range?: string | null
          ritual?: boolean | null
          school: string
        }
        Update: {
          at_higher_levels?: string | null
          casting_time?: string | null
          classes?: string[] | null
          components?: Json | null
          concentration?: boolean | null
          description?: string | null
          duration?: string | null
          id?: number
          level?: number
          name?: string
          range?: string | null
          ritual?: boolean | null
          school?: string
        }
        Relationships: []
      }
      spells_known: {
        Row: {
          character_id: string | null
          id: string
          prepared: boolean | null
          spell_id: number | null
          spellcasting_ability: string | null
        }
        Insert: {
          character_id?: string | null
          id?: string
          prepared?: boolean | null
          spell_id?: number | null
          spellcasting_ability?: string | null
        }
        Update: {
          character_id?: string | null
          id?: string
          prepared?: boolean | null
          spell_id?: number | null
          spellcasting_ability?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spells_known_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spells_known_spell_id_fkey"
            columns: ["spell_id"]
            isOneToOne: false
            referencedRelation: "spells"
            referencedColumns: ["id"]
          },
        ]
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
