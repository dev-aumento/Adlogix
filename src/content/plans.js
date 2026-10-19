import { toPlainText, toBoolean, toLines, toPipeRows } from '../services/normalizers';
import { text, groupList } from './helpers';

/**
 * Growth Plans content, shared by every place that can show pricing: the Home, Services and
 * Reels pages, and each Services entry. Each of them stores its own `plans_*` fields, so the
 * pricing shown on a page is the pricing edited on that page.
 *
 * `plansDefaults` is the safety fallback used when WordPress can't be reached.
 */
export const plansDefaults = {
  badge: "Regular Package Options",
  title: "Choose Your Growth Plan",
  highlight: "Growth Plan",
  subtitle: "All packages include a minimum term of 3 months. Meta Ads budget (₹500/day) paid directly by client. 18% GST charged additionally on all packages.",
  plans: [
    {
      id: "basic-boost",
      name: "Basic Boost",
      tagline: "Ideal for emerging brands building consistent social reach & lead flow.",
      isPopular: false,
      popularBadge: "",
      pricing: {
        monthly: { price: "₹30,000", period: "/month", total: "" },
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
        monthly: { price: "₹40,000", period: "/month", total: "" },
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
      popularBadge: "",
      pricing: {
        monthly: { price: "₹70,000", period: "/month", total: "" },
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
  ],
  disclaimer: "* 18% GST charged additionally on all packages. Ad budgets paid directly by the client to Meta platforms. Pricing applies within Gujarat / Ahmedabad; travel costs extra for outside shoots.",
  helpText: "Need a custom enterprise scope, web application, or nationwide video crew?",
  helpButtonLabel: "Book a Strategy Call →"
};

const slugify = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** One `plans_plan_N` group. A plan needs a name and a monthly price, otherwise it is dropped. */
const mapPlan = (group) => {
  const name = toPlainText(group.name);
  const monthlyPrice = toPlainText(group.monthly_price);
  if (!name || !monthlyPrice) return null;
  return {
    id: slugify(name),
    name,
    tagline: toPlainText(group.tagline),
    isPopular: toBoolean(group.is_popular),
    popularBadge: toPlainText(group.popular_badge),
    pricing: {
      monthly: { price: monthlyPrice, period: toPlainText(group.monthly_period), total: toPlainText(group.monthly_total) },
      quarterly: { price: toPlainText(group.quarterly_price), period: toPlainText(group.quarterly_period), total: toPlainText(group.quarterly_total) },
      annual: { price: toPlainText(group.annual_price), period: toPlainText(group.annual_period), total: toPlainText(group.annual_total) }
    },
    metrics: toPipeRows(group.metrics, ['value', 'label']).filter((m) => m.value),
    features: toLines(group.features),
    ctaText: toPlainText(group.cta_label)
  };
};

/** The `plans_*` fields of any page or Services entry, in the shape GrowthPlansSection expects. */
export function mapPlansFields(f) {
  return {
    badge: text(f, 'plans_badge'),
    title: text(f, 'plans_title'),
    highlight: text(f, 'plans_highlight'),
    subtitle: text(f, 'plans_subtitle'),
    plans: groupList(f, 'plans_plan', 3, mapPlan),
    disclaimer: text(f, 'plans_disclaimer'),
    helpText: text(f, 'plans_help_text'),
    helpButtonLabel: text(f, 'plans_help_button')
  };
}

/** True when a plans block holds nothing an editor filled in. */
export const isPlansEmpty = (plans) =>
  !plans
  || (plans.plans.length === 0 && !plans.badge && !plans.title && !plans.subtitle
      && !plans.disclaimer && !plans.helpText && !plans.helpButtonLabel);
