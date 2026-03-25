export type SubscriptionStatus = "active" | "inactive" | "lapsed";
export type SubscriptionPlan = "monthly" | "yearly" | null;
export type DrawStatus = "pending" | "simulated" | "published";
export type DrawType = "random" | "algorithmic";
export type MatchType = "5_match" | "4_match" | "3_match" | null;

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  subscription_status: SubscriptionStatus;
  subscription_plan: SubscriptionPlan;
  subscription_renewal_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  selected_charity_id: string | null;
  charity_percentage: number;
  is_admin: boolean;
  created_at: string;
}

export interface GolfScore {
  id: string;
  user_id: string;
  score: number;
  played_date: string;
  created_at: string;
}
