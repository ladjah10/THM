import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AssessmentTest() {
  const [assessmentType, setAssessmentType] = useState<'individual' | 'couple'>('individual');
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Assessment Type Test</h1>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                checked={assessmentType === 'individual'} 
                onChange={() => setAssessmentType('individual')}
              />
              <span>Individual Assessment ($49)</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                checked={assessmentType === 'couple'} 
                onChange={() => setAssessmentType('couple')}
              />
              <span>Couple Assessment ($79)</span>
            </label>
          </div>
          
          <div className="p-4 rounded-md bg-blue-50 text-blue-800">
            <p>Selected Assessment Type: <strong>{assessmentType}</strong></p>
            <p className="text-sm text-blue-700 mt-2">
              {assessmentType === 'individual' 
                ? 'Individual Assessment: Discover your expectations and relationship style.'
                : 'Couple Assessment: Compare expectations and identify areas of alignment.'}
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => {
                window.location.href = `/assessment?type=${assessmentType}`;
              }}
              className={assessmentType === 'individual' 
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-purple-600 hover:bg-purple-700'
              }
            >
              Start {assessmentType === 'individual' ? 'Individual' : 'Couple'} Assessment
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}