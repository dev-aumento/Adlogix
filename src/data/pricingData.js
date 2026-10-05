export const growthPlansData = {
  badge: "Regular Package Options",
  title: "Choose Your Growth Plan",
  highlightWord: "Growth Plan",
  subtitle: "All packages include a minimum term of 3 months. Meta Ads budget (₹500/day) paid directly by client. 18% GST charged additionally on all packages.",
  disclaimer: "* 18% GST charged additionally on all packages. Ad budgets paid directly by the client to Meta platforms. Pricing applies within Gujarat / Ahmedabad; travel costs extra for outside shoots.",
  plans: [
    {
      id: "basic-boost",
      name: "Basic Boost",
      tagline: "Ideal for emerging brands building consistent social reach & lead flow.",
      isPopular: false,
      pricing: {
        monthly: { price: "₹30,000", period: "/month", billingNote: "Billed monthly (3-month min)" },
        quarterly: { price: "₹27,000", period: "/month", total: "₹81,000 billed quarterly (Save 10%)" },
        annual: { price: "₹24,000", period: "/month", total: "₹2,88,000 billed annually (Save 20%)" }
      },
      metrics: [
        { value: "10", label: "REELS/MO" },
        { value: "1", label: "SHOOT" },
        { value: "1", label: "MONTH" }
      ],
      features: [
        "10 Reels per Month",
        "1 Shoot Visit per Month",
        "Minimum Term: 3 Months",
        "Meta Ads Budget: ₹500/day by Client",
        "Instagram Page Management",
        "Content Planning & Strategy",
        "Monthly Performance Report"
      ],
      ctaText: "Get Started"
    },
    {
      id: "advanced-growth",
      name: "Advanced Growth",
      tagline: "Engineered for scaling businesses needing multi-hook viral content & ads.",
      isPopular: true,
      popularBadge: "MOST POPULAR",
      pricing: {
        monthly: { price: "₹40,000", period: "/month", billingNote: "Billed monthly (3-month min)" },
        quarterly: { price: "₹36,000", period: "/month", total: "₹1,08,000 billed quarterly (Save 10%)" },
        annual: { price: "₹32,000", period: "/month", total: "₹3,84,000 billed annually (Save 20%)" }
      },
      metrics: [
        { value: "15", label: "REELS/MO" },
        { value: "2", label: "SHOOTS" },
        { value: "1", label: "MONTH" }
      ],
      features: [
        "15 Reels per Month",
        "2 Shoot Visits per Month",
        "Minimum Term: 3 Months",
        "Meta Ads Budget: ₹500/day by Client",
        "Instagram Page Management",
        "Content Planning & Strategy",
        "Influencer Marketing",
        "Monthly Performance Report"
      ],
      ctaText: "Get Started"
    },
    {
      id: "premium-impact",
      name: "Premium Impact",
      tagline: "Complete multi-channel creative dominance, rapid content scaling & VIP support.",
      isPopular: false,
      pricing: {
        monthly: { price: "₹70,000", period: "/month", billingNote: "Billed monthly (3-month min)" },
        quarterly: { price: "₹63,000", period: "/month", total: "₹1,89,000 billed quarterly (Save 10%)" },
        annual: { price: "₹56,000", period: "/month", total: "₹6,72,000 billed annually (Save 20%)" }
      },
      metrics: [
        { value: "25", label: "REELS/MO" },
        { value: "3", label: "SHOOTS" },
        { value: "1", label: "MONTH" }
      ],
      features: [
        "25 Reels per Month",
        "3 Shoot Visits per Month",
        "Minimum Term: 3 Months",
        "Meta Ads Budget: ₹500/day by Client",
        "Instagram Page Management",
        "Content Planning & Strategy",
        "Influencer Marketing",
        "Priority Support & Performance Report"
      ],
      ctaText: "Get Started"
    }
  ]
};
