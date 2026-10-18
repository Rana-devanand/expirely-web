import { api } from "./api";

export type PlanInterval = "monthly" | "yearly";

export type PricingPlan = {
  interval: PlanInterval;
  baseAmountUsd: number;
  localAmount: number;
  savingsPercent: number | null;
};

export type Pricing = {
  country: string | null;
  billedCurrency: string;
  displayCurrency: string;
  approximate: boolean;
  rateSource: string;
  plans: PricingPlan[];
};

export type SubscriptionStatus = {
  isPremium: boolean;
  plan: "free" | "premium";
  status: string;
  interval: PlanInterval | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export type PaymentRecord = {
  status: string;
  amountMinor: number | null;
  currency: string | null;
  interval: PlanInterval | null;
  createdAt: string;
};

export const billingService = {
  getPricing: async (country?: string | null): Promise<Pricing> => {
    const query = country ? `?country=${encodeURIComponent(country)}` : "";
    const res: any = await api.get(`/pricing${query}`);
    return res.data;
  },

  getStatus: async (): Promise<SubscriptionStatus> => {
    const res: any = await api.get("/subscription/status");
    return res.data;
  },

  // The user's saved country (set by the mobile app), if any.
  getSavedCountry: async (): Promise<string | null> => {
    try {
      const res: any = await api.get("/users/location");
      return res?.data?.country || null;
    } catch {
      return null;
    }
  },

  getPayments: async (): Promise<PaymentRecord[]> => {
    const res: any = await api.get("/subscription/payments");
    return res.data ?? [];
  },

  // Asks the backend to confirm the payment with Dodo (does not rely on the webhook).
  syncSubscription: async (subscriptionId: string, paymentId?: string | null): Promise<SubscriptionStatus> => {
    const res: any = await api.post("/subscription/sync", { subscriptionId, paymentId: paymentId || undefined });
    return res.data;
  },

  // Stops renewal. The user keeps Premium until the end of the paid period.
  cancelSubscription: async (): Promise<SubscriptionStatus> => {
    const res: any = await api.post("/subscription/cancel", {});
    return res.data;
  },

  // Undo a cancellation before the period ends.
  resumeSubscription: async (): Promise<SubscriptionStatus> => {
    const res: any = await api.post("/subscription/resume", {});
    return res.data;
  },

  startCheckout: async (interval: PlanInterval): Promise<string> => {
    const res: any = await api.post("/subscription/checkout", { interval });
    return res.data.checkoutUrl as string;
  },
};

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

// Amounts from the payment provider are in the currency's smallest unit.
export function formatMinor(amountMinor: number | null, currency: string | null): string {
  if (amountMinor === null || amountMinor === undefined) return '';
  const code = (currency || 'USD').toUpperCase();
  try {
    const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: code });
    const digits = fmt.resolvedOptions().maximumFractionDigits ?? 2;
    return fmt.format(amountMinor / Math.pow(10, digits));
  } catch {
    return `${code} ${(amountMinor / 100).toFixed(2)}`;
  }
}
