export type PreviewInterest = "skincare" | "makeup" | "both" | "exploring";
export type PreviewPreferences = {
  interest: PreviewInterest;
  skincareType: string;
  makeupType: string;
  skinType: string;
  finish: string;
  budget: string;
};

export const INTERESTS = [
  { value: "skincare", label: "Skincare" },
  { value: "makeup", label: "Makeup" },
  { value: "both", label: "Both" },
  { value: "exploring", label: "Just exploring" },
] as const;
export const SKINCARE_TYPES = ["Cleanser", "Moisturizer", "Serum", "Sunscreen", "Toner"];
export const MAKEUP_TYPES = ["Foundation", "Concealer", "Blush", "Lip products", "Mascara", "Eye makeup"];
export const SKIN_TYPES = ["Dry", "Oily", "Combination", "Balanced", "Sensitive"];
export const FINISHES = ["Natural", "Dewy", "Matte", "Satin"];

export function initialPreferences(interest: PreviewInterest = "exploring"): PreviewPreferences {
  return { interest, skincareType: "", makeupType: "", skinType: "", finish: "", budget: "" };
}

export function isPreviewInterest(value: unknown): value is PreviewInterest {
  return typeof value === "string" && INTERESTS.some((interest) => interest.value === value);
}

export function preferenceLabels(value: PreviewPreferences) {
  const hasSkincare = value.interest === "skincare" || value.interest === "both";
  const hasMakeup = value.interest === "makeup" || value.interest === "both";
  return {
    interest: INTERESTS.find((interest) => interest.value === value.interest)?.label ?? "Just exploring",
    products: [hasSkincare && value.skincareType, hasMakeup && value.makeupType].filter(Boolean).join(" · "),
    details: [hasSkincare && value.skinType && `${value.skinType} skin`, hasMakeup && value.finish && `${value.finish} finish`].filter(Boolean).join(" · "),
    budget: value.budget ? `Up to S$${Number(value.budget).toLocaleString("en-SG", { maximumFractionDigits: 2 })}` : "",
  };
}
