/**
 * Section weights and percentages for assessment scoring
 * This file defines section weights and their proportional contributions for scoring
 */

export const SECTION_WEIGHTS: Record<string, number> = {
  "Your Foundation": 82,
  "Your Faith Life": 21,
  "Your Marriage Life": 216,
  "Your Marriage Life with Children": 126,
  "Your Family/Home Life": 34,
  "Your Finances": 58,
  "Your Health and Wellness": 49,
  "Your Marriage and Boundaries": 74
};

// Proportional contributions to final score (based on 660 total weight)
export const SECTION_PERCENTAGES: Record<string, number> = {
  "Your Foundation": 82 / 660,                   // 12.42%
  "Your Faith Life": 21 / 660,                   // 3.18%
  "Your Marriage Life": 216 / 660,               // 32.73%
  "Your Marriage Life with Children": 126 / 660, // 19.09%
  "Your Family/Home Life": 34 / 660,             // 5.15%
  "Your Finances": 58 / 660,                     // 8.79%
  "Your Health and Wellness": 49 / 660,          // 7.42%
  "Your Marriage and Boundaries": 74 / 660       // 11.21%
};

export const TOTAL_WEIGHT = 660;