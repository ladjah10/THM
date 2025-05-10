import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Button } from "@/components/ui/button";
import { UserProfile, AssessmentScores } from "@/types/assessment";
import { FaDownload, FaShare } from "react-icons/fa6";

interface ShareableImageProps {
  profile: UserProfile;
  genderProfile?: UserProfile | null;
  scores: AssessmentScores;
  name: string;
}

export function ShareableImage({ profile, genderProfile, scores, name }: ShareableImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const firstName = name.split(' ')[0];
  
  const downloadImage = async () => {
    if (!imageRef.current) return;
    
    try {
      const dataUrl = await toPng(imageRef.current, { 
        quality: 0.95,
        width: 1200,
        height: 630,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      // Create an anchor element to initiate download
      const link = document.createElement('a');
      link.download = `100-marriage-assessment-${firstName.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-4 flex gap-3">
        <Button onClick={downloadImage} className="flex items-center gap-2">
          <FaDownload size={16} />
          <span>Download Shareable Image</span>
        </Button>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md max-w-full">
        {/* This is a preview that's sized proportionally to 1200x630 but maintains responsive size */}
        <div className="relative" style={{ paddingBottom: '52.5%' /* 630/1200 = 0.525 */ }}>
          <div className="absolute inset-0 scale-[0.25] sm:scale-[0.33] md:scale-[0.5] origin-top-left pointer-events-none">
            {/* This is what gets converted to an image */}
            <div 
              ref={imageRef} 
              className="w-[1200px] h-[630px] bg-white relative overflow-hidden"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {/* Decorative Bar */}
              <div className="h-[10px] bg-gradient-to-r from-blue-500 to-blue-800 w-full"></div>
              
              {/* Content Container */}
              <div className="p-[40px]">
                {/* Header */}
                <div className="text-center mb-[20px]">
                  <h1 className="text-[36px] font-bold text-gray-800 mb-[10px]">
                    The 100 Marriage Assessment Results
                  </h1>
                  {name && (
                    <div className="text-[24px] text-gray-600 mb-[40px]">
                      Results for {firstName}
                    </div>
                  )}
                </div>
                
                {/* Profile */}
                <div className="flex items-center justify-center my-[40px]">
                  <div className="text-center max-w-[800px]">
                    <div className="text-[42px] text-blue-600 mb-[10px] font-bold">
                      {profile.name}
                    </div>
                    <div className="text-[64px] font-bold text-blue-800 my-[10px]">
                      {scores.overallPercentage.toFixed(1)}%
                    </div>
                    
                    {genderProfile && (
                      <div className="text-[28px] text-purple-700 mt-[20px]">
                        {genderProfile.name}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="absolute bottom-[20px] left-0 right-0 text-center">
                  <div className="text-[24px] text-gray-700">
                    Take the assessment yourself
                  </div>
                  <div className="text-[18px] text-gray-500 mt-[5px]">
                    https://the100marriage.lawrenceadjah.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Download this image to share on social media platforms or attach to messages.
      </p>
    </div>
  );
}