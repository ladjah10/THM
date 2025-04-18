/**
 * Utilities for statistical analysis and comparisons of assessment scores
 */

/**
 * Calculate percentile rank of a score within a dataset
 * @param score The score to calculate percentile for
 * @param dataset Array of scores to compare against
 * @returns Percentile rank (0-100)
 */
export function calculatePercentile(score: number, dataset: number[]): number {
  if (dataset.length === 0) return 50; // Default to 50th percentile if no data
  
  // Count how many scores in the dataset are less than or equal to the given score
  const countBelow = dataset.filter(dataPoint => dataPoint <= score).length;
  
  // Calculate percentile
  const percentile = (countBelow / dataset.length) * 100;
  
  return Math.round(percentile);
}

/**
 * Calculate mean (average) of a dataset
 * @param dataset Array of numbers
 * @returns Mean value
 */
export function calculateMean(dataset: number[]): number {
  if (dataset.length === 0) return 0;
  
  const sum = dataset.reduce((acc, val) => acc + val, 0);
  return sum / dataset.length;
}

/**
 * Calculate median value of a dataset
 * @param dataset Array of numbers
 * @returns Median value
 */
export function calculateMedian(dataset: number[]): number {
  if (dataset.length === 0) return 0;
  
  // Sort the dataset
  const sortedData = [...dataset].sort((a, b) => a - b);
  
  // Find the middle value
  const middleIndex = Math.floor(sortedData.length / 2);
  
  // If dataset has odd number of elements, return middle one
  if (sortedData.length % 2 !== 0) {
    return sortedData[middleIndex];
  }
  
  // If dataset has even number of elements, return average of two middle ones
  return (sortedData[middleIndex - 1] + sortedData[middleIndex]) / 2;
}

/**
 * Calculate standard deviation of a dataset
 * @param dataset Array of numbers
 * @returns Standard deviation
 */
export function calculateStandardDeviation(dataset: number[]): number {
  if (dataset.length <= 1) return 0;
  
  const mean = calculateMean(dataset);
  const squaredDifferences = dataset.map(value => Math.pow(value - mean, 2));
  const variance = calculateMean(squaredDifferences);
  
  return Math.sqrt(variance);
}

/**
 * Default baseline statistics from initial respondents
 * These values will be used for comparative analysis until more respondents provide data
 */
export const baselineStatistics = {
  // Overall scores
  overall: {
    mean: 83.6, // Mean overall score (percentage)
    median: 85.5, // Median overall score
    standardDeviation: 8.5, // Standard deviation of overall scores
    byGender: {
      male: {
        mean: 81.2,
        median: 83.5, 
        standardDeviation: 9.2
      },
      female: {
        mean: 85.0,
        median: 87.2,
        standardDeviation: 7.5
      }
    }
  },
  
  // Section scores
  sections: {
    "Your Marriage and Boundaries": {
      mean: 85,
      median: 87,
      standardDeviation: 8,
      byGender: {
        male: { mean: 82, median: 84, standardDeviation: 7 },
        female: { mean: 87, median: 88, standardDeviation: 8 }
      }
    },
    "Your Marriage Life": {
      mean: 82,
      median: 84,
      standardDeviation: 9,
      byGender: {
        male: { mean: 79, median: 82, standardDeviation: 8 },
        female: { mean: 83, median: 85, standardDeviation: 9 }
      }
    },
    "Your Faith Life": {
      mean: 87,
      median: 89,
      standardDeviation: 8,
      byGender: {
        male: { mean: 85, median: 87, standardDeviation: 9 },
        female: { mean: 89, median: 91, standardDeviation: 7 }
      }
    },
    "Your Family/Home Life": {
      mean: 83,
      median: 85,
      standardDeviation: 9,
      byGender: {
        male: { mean: 81, median: 84, standardDeviation: 10 },
        female: { mean: 85, median: 87, standardDeviation: 8 }
      }
    },
    "Your Finances": {
      mean: 78,
      median: 80,
      standardDeviation: 12,
      byGender: {
        male: { mean: 82, median: 84, standardDeviation: 10 },
        female: { mean: 76, median: 78, standardDeviation: 13 }
      }
    },
    "Your Health and Wellness": {
      mean: 80,
      median: 82,
      standardDeviation: 10,
      byGender: {
        male: { mean: 82, median: 84, standardDeviation: 9 },
        female: { mean: 78, median: 81, standardDeviation: 11 }
      }
    },
    "Your Parenting Life": {
      mean: 84,
      median: 86,
      standardDeviation: 11,
      byGender: {
        male: { mean: 87, median: 89, standardDeviation: 9 },
        female: { mean: 81, median: 83, standardDeviation: 12 }
      }
    },
    "Your Foundation": {
      mean: 86,
      median: 88,
      standardDeviation: 8,
      byGender: {
        male: { mean: 85, median: 87, standardDeviation: 9 },
        female: { mean: 87, median: 89, standardDeviation: 8 }
      }
    },
  },
  
  // Profile distributions
  profileDistribution: {
    // Unisex profiles
    "Steadfast Believers": 32, // Percentage of respondents with this profile
    "Harmonious Planners": 24,
    "Flexible Faithful": 18,
    "Pragmatic Partners": 12,
    "Individualist Seekers": 5,
    "Balanced Visionaries": 9,
    
    // Gender-specific profiles - Female
    "Relational Nurturers": 28, // Percentage of female respondents with this profile
    "Adaptive Communicators": 22,
    "Independent Traditionalists": 14,
    "Faith-Centered Homemakers": 36,
    
    // Gender-specific profiles - Male
    "Faithful Protectors": 40, // Percentage of male respondents with this profile
    "Structured Leaders": 35,
    "Balanced Providers": 25
  }
};

/**
 * Get statistical description for a percentile value
 * @param percentile Percentile rank (0-100)
 * @returns Descriptive text about the percentile
 */
export function getPercentileDescription(percentile: number): string {
  if (percentile >= 95) return "Much higher than most respondents";
  if (percentile >= 75) return "Higher than most respondents";
  if (percentile >= 60) return "Somewhat higher than average";
  if (percentile >= 40) return "About average";
  if (percentile >= 25) return "Somewhat lower than average";
  if (percentile >= 5) return "Lower than most respondents";
  return "Much lower than most respondents";
}

/**
 * Determine if a higher or lower percentile is generally preferable
 * for interpretation purposes (not a value judgment)
 * @param sectionName The name of the section
 * @returns Text explaining what the percentile means
 */
export function getPercentileInterpretation(sectionName: string): string {
  const defaultInterpretation = 
    "Higher percentages typically indicate more traditional views on this topic, " +
    "while lower percentages suggest less traditional approaches.";
    
  // Section-specific interpretations could be added here
  const sectionNameLower = sectionName.toLowerCase();
  
  switch(true) {
    case sectionNameLower === 'overall':
      return "Your overall score reflects your perspectives on relationship. " + defaultInterpretation;
    case sectionNameLower.includes('marriage and boundaries'):
      return "Your Marriage and Boundaries score reflects how you view communication in relationships. " + defaultInterpretation;
    case sectionNameLower.includes('faith life'):
      return "Your Faith Life score reflects the centrality of spiritual matters in your relationship approach. " + defaultInterpretation;
    case sectionNameLower.includes('foundation'):
      return "Your Foundation score reflects your core values that form the basis of your relationship expectations. " + defaultInterpretation;
    case sectionNameLower.includes('marriage life'):
      return "Your Marriage Life score indicates your expectations for day-to-day married life. " + defaultInterpretation;
    case sectionNameLower.includes('parenting'):
      return "Your Parenting Life score shows how you view raising children and family planning. " + defaultInterpretation;
    case sectionNameLower.includes('family'):
      return "Your Family/Home Life score indicates your expectations about family dynamics and home management. " + defaultInterpretation;
    case sectionNameLower.includes('finances'):
      return "Your Finances score reflects your approach to money management and financial decisions in relationships. " + defaultInterpretation;
    case sectionNameLower.includes('health'):
      return "Your Health and Wellness score shows your perspectives on physical and mental wellbeing in relationships. " + defaultInterpretation;
    default:
      return defaultInterpretation;
  }
}