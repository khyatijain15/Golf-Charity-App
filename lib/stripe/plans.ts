export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID ?? "price_xxx",
    amount: 1999,
    label: "£19.99/month",
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID ?? "price_xxx",
    amount: 18999,
    label: "£189.99/year (save 21%)",
  },
} as const;

export type PlanKey = keyof typeof PLANS;
