// Sample data generator for testing purposes
import { storage } from './storage';
import { randomUUID } from 'crypto';

// Function to create sample assessment data
export async function createSampleAssessmentData() {
  try {
    // Sample assessment data
    const sampleAssessments = [
      {
        id: randomUUID(),
        email: 'john.doe@example.com',
        name: 'John Doe',
        scores: {
          sections: {
            "Shared Beliefs": { earned: 18, possible: 20, percentage: 90 },
            "Family Foundation": { earned: 16, possible: 20, percentage: 80 },
            "Physical Partnership": { earned: 17, possible: 20, percentage: 85 },
            "Intellectual Stimulation": { earned: 17, possible: 20, percentage: 85 },
            "Relationship Needs": { earned: 19, possible: 20, percentage: 95 },
          },
          overallPercentage: 87.0,
          strengths: ["Relationship Needs", "Shared Beliefs"],
          improvementAreas: ["Family Foundation"],
          totalEarned: 87,
          totalPossible: 100
        },
        profile: {
          id: "TYPE_A",
          name: "The Committed Partner",
          description: "Values tradition and stability in relationships."
        },
        genderProfile: {
          id: "MALE_TYPE_A",
          name: "The Traditional Husband",
          description: "Seeks to be a provider and protector in marriage."
        },
        responses: {
          "q1": { option: "strongly-agree", value: 5 },
          "q2": { option: "agree", value: 4 },
          "q3": { option: "neutral", value: 3 }
        },
        demographics: {
          age: "30-40",
          gender: "male",
          location: "United States",
          marriageStatus: "married",
          relationshipLength: "5-10",
          hasChildren: "yes",
          education: "bachelors",
          occupation: "professional"
        },
        timestamp: new Date().toISOString(),
        transactionId: randomUUID(),
        coupleId: null,
        coupleRole: null,
        reportSent: true
      },
      {
        id: randomUUID(),
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        scores: {
          sections: {
            "Shared Beliefs": { earned: 19, possible: 20, percentage: 95 },
            "Family Foundation": { earned: 18, possible: 20, percentage: 90 },
            "Physical Partnership": { earned: 16, possible: 20, percentage: 80 },
            "Intellectual Stimulation": { earned: 18, possible: 20, percentage: 90 },
            "Relationship Needs": { earned: 17, possible: 20, percentage: 85 },
          },
          overallPercentage: 88.0,
          strengths: ["Shared Beliefs", "Intellectual Stimulation"],
          improvementAreas: ["Physical Partnership"],
          totalEarned: 88,
          totalPossible: 100
        },
        profile: {
          id: "TYPE_B",
          name: "The Communicative Partner",
          description: "Values open communication and emotional connection."
        },
        genderProfile: {
          id: "FEMALE_TYPE_B",
          name: "The Expressive Wife",
          description: "Values communication and emotional intimacy in marriage."
        },
        responses: {
          "q1": { option: "strongly-agree", value: 5 },
          "q2": { option: "strongly-agree", value: 5 },
          "q3": { option: "agree", value: 4 }
        },
        demographics: {
          age: "30-40",
          gender: "female",
          location: "United States",
          marriageStatus: "married",
          relationshipLength: "5-10",
          hasChildren: "yes",
          education: "masters",
          occupation: "professional"
        },
        timestamp: new Date().toISOString(),
        transactionId: randomUUID(),
        coupleId: null,
        coupleRole: null,
        reportSent: true
      },
      {
        id: randomUUID(),
        email: 'michael.johnson@example.com',
        name: 'Michael Johnson',
        scores: {
          sections: {
            "Shared Beliefs": { earned: 15, possible: 20, percentage: 75 },
            "Family Foundation": { earned: 14, possible: 20, percentage: 70 },
            "Physical Partnership": { earned: 18, possible: 20, percentage: 90 },
            "Intellectual Stimulation": { earned: 16, possible: 20, percentage: 80 },
            "Relationship Needs": { earned: 16, possible: 20, percentage: 80 },
          },
          overallPercentage: 79.0,
          strengths: ["Physical Partnership", "Intellectual Stimulation"],
          improvementAreas: ["Family Foundation", "Shared Beliefs"],
          totalEarned: 79,
          totalPossible: 100
        },
        profile: {
          id: "TYPE_C",
          name: "The Adventurous Partner",
          description: "Values experience and variety in relationships."
        },
        genderProfile: {
          id: "MALE_TYPE_C",
          name: "The Adventurous Husband",
          description: "Seeks excitement and new experiences in marriage."
        },
        responses: {
          "q1": { option: "agree", value: 4 },
          "q2": { option: "neutral", value: 3 },
          "q3": { option: "strongly-agree", value: 5 }
        },
        demographics: {
          age: "40-50",
          gender: "male",
          location: "United States",
          marriageStatus: "married",
          relationshipLength: "10-15",
          hasChildren: "yes",
          education: "bachelors",
          occupation: "business"
        },
        timestamp: new Date().toISOString(),
        transactionId: null, // Unpaid assessment example
        coupleId: null,
        coupleRole: null,
        reportSent: false
      }
    ];

    // Save each sample assessment
    for (const assessment of sampleAssessments) {
      await storage.saveAssessment({
        ...assessment,
        // Convert objects to strings for storage
        scores: JSON.stringify(assessment.scores),
        profile: JSON.stringify(assessment.profile),
        genderProfile: JSON.stringify(assessment.genderProfile),
        responses: JSON.stringify(assessment.responses),
        demographics: JSON.stringify(assessment.demographics)
      });
    }

    console.log(`Created ${sampleAssessments.length} sample assessments for testing`);
    return sampleAssessments.length;
  } catch (error) {
    console.error('Error creating sample assessment data:', error);
    throw error;
  }
}