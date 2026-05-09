import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      ai_config: {
        Row: {
          id: string;
          model: string;
          max_tokens: number;
          temperature: number;
          is_active: boolean;
          created_at: string;
        };
      };
      system_prompts: {
        Row: {
          id: string;
          content: string;
          version: number;
          is_active: boolean;
          created_at: string;
        };
      };
      guardrails: {
        Row: {
          id: string;
          rule: string;
          category: string;
          is_active: boolean;
          created_at: string;
        };
      };
      chat_logs: {
        Row: {
          id: string;
          session_id: string;
          user_message: string;
          ai_response: string;
          model_used: string;
          tokens_used: number | null;
          created_at: string;
        };
      };
    };
  };
};
