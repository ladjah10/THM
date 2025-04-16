import React from 'react';
import { Button } from "@/components/ui/button";
import { UserProfile, AssessmentScores } from "@/types/assessment";
import { 
  FaLinkedin, 
  FaInstagram, 
  FaXTwitter 
} from "react-icons/fa6";

interface SocialShareProps {
  profile: UserProfile;
  genderProfile?: UserProfile | null;
  scores: AssessmentScores;
  name: string;
  gender: string;
}

export function SocialShareButtons({ profile, genderProfile, scores, name, gender }: SocialShareProps) {
  const firstName = name.split(' ')[0];
  const baseUrl = "https://100marriage-assessment.replit.app";
  const shareUrl = `${baseUrl}`;

  // Generate short description based on profiles
  const createDescription = (): string => {
    const primaryProfile = profile.name;
    const genProfile = genderProfile ? genderProfile.name : null;
    const overallScore = Math.round(scores.overallPercentage);
    
    return genProfile
      ? `I'm a ${primaryProfile} / ${genProfile} (${overallScore}%)`
      : `I'm a ${primaryProfile} (${overallScore}%)`;
  };

  const shareDescription = createDescription();
  
  // Create the share messages
  const linkedInMessage = `I just completed The 100 Marriage Assessment - Series 1 by Lawrence E. Adjah! ${shareDescription}. Discover your own marriage readiness profile and compatibility insights. #100Marriage #RelationshipInsights`;
  
  const twitterMessage = `Just completed The 100 Marriage Assessment! ${shareDescription}. Discover your own marriage readiness profile and compatibility insights. #100Marriage`;
  
  const instagramMessage = `I just completed The 100 Marriage Assessment - Series 1 by Lawrence E. Adjah!\n\n${shareDescription}.\n\nDiscover your own marriage readiness profile and compatibility insights.\n\n#100Marriage #RelationshipInsights #MarriageReadiness`;

  // Create the share URLs
  const createLinkedInShareUrl = () => {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent("My 100 Marriage Assessment Results")}&summary=${encodeURIComponent(linkedInMessage)}`;
  };

  const createTwitterShareUrl = () => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}&url=${encodeURIComponent(shareUrl)}`;
  };

  // For Instagram, we'll use a copy-to-clipboard approach since Instagram doesn't support direct sharing via URLs
  const copyInstagramText = () => {
    navigator.clipboard.writeText(instagramMessage).then(() => {
      alert("Caption copied to clipboard! Open Instagram to create a post with this caption.");
    }).catch(err => {
      console.error('Failed to copy: ', err);
      alert("Failed to copy caption. Please try again.");
    });
  };
  
  // Generate a sharable image URL - in a real implementation, this would generate a dynamic image
  const getShareImageUrl = () => {
    // In a production environment, this would be an API endpoint that generates a custom image
    // For now, we'll just return a static URL that uses query parameters
    return `${baseUrl}/api/share-image?profile=${encodeURIComponent(profile.name)}&score=${scores.overallPercentage.toFixed(1)}&name=${encodeURIComponent(firstName)}`;
  };

  return (
    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 space-y-4">
      <h3 className="text-xl font-medium text-gray-900 mb-4">Share Your Results</h3>
      
      <p className="text-gray-600 text-sm mb-4">
        Share your assessment results with friends and invite them to discover their own marriage readiness profile!
      </p>
      
      <div className="flex flex-col md:flex-row gap-3">
        <Button 
          onClick={() => window.open(createLinkedInShareUrl(), '_blank')} 
          className="flex items-center gap-2 bg-[#0077b5] hover:bg-[#005e8d]"
        >
          <FaLinkedin size={18} />
          <span>Share on LinkedIn</span>
        </Button>
        
        <Button 
          onClick={() => window.open(createTwitterShareUrl(), '_blank')} 
          className="flex items-center gap-2 bg-black hover:bg-gray-800"
        >
          <FaXTwitter size={18} />
          <span>Share on X</span>
        </Button>
        
        <Button 
          onClick={copyInstagramText} 
          className="flex items-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90"
        >
          <FaInstagram size={18} />
          <span>Copy for Instagram</span>
        </Button>
      </div>
      
      <div className="pt-3 mt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Note: Sharing your results will not include any personal information beyond what you choose to share in your post.
          The full assessment details remain private to you.
        </p>
      </div>
    </div>
  );
}