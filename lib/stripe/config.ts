
export const PLANS = [
  {
    name: 'Monthly Subscription',
    id: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || process.env.STRIPE_MONTHLY_PRICE_ID || 'price_1TEU0sFBX85Oka65m4u9vvGX',
    interval: 'month',
    amount: 1999, // £19.99
    currency: 'gbp',
  },
  {
    name: 'Yearly Subscription',
    id: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || process.env.STRIPE_YEARLY_PRICE_ID || 'price_1TEU2WFBX85Oka65iBU68fjc',
    interval: 'year',
    amount: 18999, // £189.99
    currency: 'gbp',
  },
];
