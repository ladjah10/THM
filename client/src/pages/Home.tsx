import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [_, navigate] = useLocation();
  
  const handleStartAssessment = () => {
    navigate('/assessment');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section with Gradient Background */}
      <header className="relative py-16 px-4 text-center overflow-hidden bg-gradient-to-b from-blue-100 to-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ opacity: 0.2 }}></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 font-serif mb-4">
            The 100 Marriage Assessment – Series 1: Align Expectations, Build Your Future
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Misaligned Expectations Can Derail Your Future—Align Yours for Only $49
          </p>
          <div className="mb-6 px-4 py-3 bg-blue-50 rounded-md border border-blue-100 inline-block">
            <p className="text-blue-800 font-medium mb-2">
              <span className="font-bold">Individual Assessment ($49):</span> Beneficial for both singles and couples.
            </p>
            <p className="text-blue-700 text-sm">
              <strong>Couples Benefit:</strong> Each spouse can take their own assessment and compare scores.
              The closer your percentages align, the more aligned your marriage expectations.
            </p>
            <p className="text-blue-600 text-xs mt-2">
              Enhanced couples assessment with comparison analysis coming soon ($79).
            </p>
          </div>
          <div>
            <Button 
              onClick={handleStartAssessment}
              className="bg-amber-500 hover:bg-amber-400 text-white py-3 px-8 rounded-md text-lg font-medium"
            >
              Start Individual Assessment
            </Button>
          </div>
        </div>
      </header>

      {/* Value Proposition Section */}
      <section className="py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
            Why Take The 100 Marriage Assessment—Whether Dating, Engaged, or Committed?
          </h2>
          <p className="text-lg text-gray-700">
            Discover How to Uncover Hidden Expectations, Prepare for a God-Centered Future, and Thrive—Whether You're Dating, Engaged, or Building a Stronger Bond.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-8">
            Here's What You'll Gain to Prepare for a Thriving Future:
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">In-Depth ~100 Question Assessment</h3>
                <p className="text-gray-600">Uncover Expectations for Dating, Engagement, or Marriage</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Personalized PDF Report</h3>
                <p className="text-gray-600">With Insights to Guide Your Journey to a Lasting Relationship</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Custom Profile</h3>
                <p className="text-gray-600">Clarify Your Expectations and Dynamics—Perfect for Dating or Deepening Commitment</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Exclusive Access to Consultation</h3>
                <p className="text-gray-600">Book a 1:1 with Marriage Expert Lawrence Adjah for Personalized Guidance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img 
              src="/attached_assets/image_1744661653587.png" 
              alt="The 100 Marriage Book Cover" 
              className="h-auto max-w-full shadow-lg rounded-md" 
              style={{ maxHeight: '500px' }}
            />
          </div>
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
              Based on the Best-Selling Book
            </h2>
            <p className="text-lg text-gray-700">
              Inspired by the best-selling book <em>The 100 Marriage</em> by Lawrence E. Adjah, this assessment brings the book's proven framework to life—helping you avoid misaligned expectations that can destroy your forever.
            </p>
            <div className="pt-4">
              <Button 
                onClick={() => window.open('https://lawrenceadjah.com/the100marriagebook', '_blank')}
                className="bg-amber-500 hover:bg-amber-400 text-white py-3 px-6 rounded-md text-base font-medium"
              >
                Purchase or Gift the Book
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="italic text-gray-600">
                "The 100 Marriage offers profound wisdom for singles, couples, and marrieds alike, guiding them to create a marriage built on aligned expectations and God's plan."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8">
            Trusted by Singles and Couples Alike
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg text-gray-700 italic mb-4">
                "This assessment helped me understand my expectations for marriage, making dating so much clearer!"
              </p>
              <p className="font-medium text-gray-900">— Emily</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg text-gray-700 italic mb-4">
                "It opened our eyes to new ways to grow together in faith and love. We feel more connected than ever!"
              </p>
              <p className="font-medium text-gray-900">— Sarah & John</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 text-center bg-blue-900 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Begin Your Journey to a Thriving Future Today
          </h2>
          <p className="text-xl mb-8">
            Unlock insights that will transform your relationship expectations for only $49
          </p>
          <Button 
            onClick={handleStartAssessment}
            className="bg-amber-500 hover:bg-amber-400 text-white py-3 px-8 rounded-md text-lg font-medium"
          >
            Start Individual Assessment Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-800 text-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm mb-2">
            By proceeding, you agree to our Terms of Service and Privacy Policy. Get ready—your personalized report will be emailed to you right after completion, guiding you toward a thriving future!
          </p>
          <div className="flex justify-center gap-4 mt-3 mb-3">
            <Button 
              variant="link" 
              onClick={() => window.open('/view-sample-results', '_blank')}
              className="text-amber-400 hover:text-amber-300"
            >
              Sample Results
            </Button>
            <Button 
              variant="link" 
              onClick={() => window.open('/view-sample-email', '_blank')}
              className="text-amber-400 hover:text-amber-300"
            >
              Sample Email
            </Button>
            <Button 
              variant="link" 
              onClick={() => window.open('/view-sample-pdf', '_blank')}
              className="text-amber-400 hover:text-amber-300"
            >
              Sample PDF
            </Button>
          </div>
          <Separator className="my-4 bg-gray-600" />
          <p className="text-center text-sm text-gray-400">
            © 2025 Lawrence E. Adjah. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
