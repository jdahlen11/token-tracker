export interface UsageRecord {
  id: string;
  created_at: string;
  project_name: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost_usd: number;
}

export interface Database {
  public: {
    Tables: {
      usage: {
        Row: UsageRecord;
        Insert: Omit<UsageRecord, 'id' | 'created_at'>;
        Update: Partial<Omit<UsageRecord, 'id'>>;
      };
    };
  };
}

export interface DailyUsage {
  date: string;
  tokens: number;
  cost: number;
}

export interface Stats {
  totalTokens: number;
  totalCost: number;
  dailyAverage: number;
}
