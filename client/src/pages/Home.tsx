import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [_, navigate] = useLocation();
  
  const handleStartIndividualAssessment = () => {
    navigate('/assessment', { replace: true, state: { assessmentType: 'individual' } });
  };
  
  const handleStartCoupleAssessment = () => {
    navigate('/assessment', { replace: true, state: { assessmentType: 'couple' } });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-900">The 100 Marriage</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <span className="text-gray-700 hover:text-blue-700 font-medium cursor-pointer">Home</span>
            </Link>
            <Link href="/about">
              <span className="text-gray-700 hover:text-blue-700 font-medium cursor-pointer">About</span>
            </Link>
            <span 
              className="text-gray-700 hover:text-blue-700 font-medium cursor-pointer"
              onClick={() => {
                document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Take Assessment
            </span>
            <a 
              href="https://lawrenceadjah.com/the100marriagebook" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-700 font-medium"
            >
              Book
            </a>
          </div>
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section with Couple Photo */}
      <div className="relative bg-gradient-to-b from-blue-100 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 font-serif mb-4">
              The 100 Marriage Assessment – Series 1
            </h1>
            <h2 className="text-2xl md:text-3xl text-indigo-800 mb-6 font-serif">
              Align Expectations, Build Your Future
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Based on the #1 best-selling expectation setting book for marriage, <a href="https://lawrenceadjah.com/the100marriagebook" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-medium hover:underline">The 100 Marriage</a>, our assessment helps you uncover critical alignment areas and build a strong foundation for lasting love.
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex">
              <Button 
                onClick={handleStartCoupleAssessment}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg w-full md:w-auto"
              >
                Take the Assessment
              </Button>
              <Button 
                onClick={() => window.open('https://lawrenceadjah.com/the100marriagebook', '_blank')}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md text-lg w-full md:w-auto"
              >
                Get the Book
              </Button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img 
              src="/assets/couple1a.jpeg" 
              alt="Happy couple embracing" 
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
      
      {/* Header Section with Assessment Options */}
      <header className="relative py-16 px-4 text-center overflow-hidden" id="assessment">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 font-serif mb-4">
            Choose Your Assessment Path
          </h2>
          <p className="text-xl text-gray-700 mb-6">
            Unlock personalized insights for your relationship journey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-2">Individual Assessment</h3>
              <p className="text-blue-700 mb-3">
                Perfect for singles, or couples who want individual insights.
              </p>
              <div className="bg-white rounded p-2 mb-4">
                <p className="text-gray-700 text-sm mb-1"><strong>Price:</strong> $49</p>
                <p className="text-gray-700 text-sm mb-1"><strong>What you get:</strong> Personal profile, detailed PDF report</p>
                <p className="text-gray-700 text-sm"><strong>Best for:</strong> Personal clarity on marriage expectations</p>
              </div>
              <Button 
                onClick={handleStartIndividualAssessment}
                className="bg-amber-500 hover:bg-amber-400 text-white py-2 px-6 rounded-md font-medium w-full"
              >
                Start Individual Assessment
              </Button>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-md border border-purple-100">
              <h3 className="text-xl font-bold text-purple-800 mb-2">Couple Assessment</h3>
              <p className="text-purple-700 mb-3">
                For couples who want to compare and align expectations.
              </p>
              <div className="bg-white rounded p-2 mb-4">
                <p className="text-gray-700 text-sm mb-1"><strong>Price:</strong> $79</p>
                <p className="text-gray-700 text-sm mb-1"><strong>What you get:</strong> Two assessments + compatibility analysis</p>
                <p className="text-gray-700 text-sm"><strong>Best for:</strong> Mutual clarity + alignment on marriage expectations</p>
              </div>
              <Button 
                onClick={handleStartCoupleAssessment}
                className="bg-purple-600 hover:bg-purple-500 text-white py-2 px-6 rounded-md font-medium w-full"
              >
                Start Couple Assessment
              </Button>
            </div>
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

      {/* Research Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-6">
            Backed by Research
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="text-gray-700 mb-4">
              Our psychographic profiles are grounded in the proven framework of The 100 Marriage and supported by leading research on marital success. Studies show that aligning expectations is key to a thriving marriage.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-blue-800 font-semibold mb-2">Dr. Donald Baucom's Research</h3>
                <p className="text-sm text-gray-600">Demonstrates that shared expectations lead to greater relationship satisfaction and stability over time.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-blue-800 font-semibold mb-2">Eli Finkel's Studies</h3>
                <p className="text-sm text-gray-600">Emphasizes the importance of adjusting expectations to realistic relationship dynamics for long-term success.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-blue-800 font-semibold mb-2">The Gottman Institute</h3>
                <p className="text-sm text-gray-600">Highlights that effective communication and mutual respect are essential for managing expectations in marriage.</p>
              </div>
            </div>
            <p className="text-gray-700 mt-6">
              Whether you're a Steadfast Believer seeking spiritual alignment or a Pragmatic Partner focused on practical compatibility, our assessment helps you understand your expectations and build a stronger future, backed by science and wisdom.
            </p>
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
              Based on the #1 Best-Selling Book
            </h2>
            <p className="text-lg text-gray-700">
              Inspired by the #1 best-selling expectation setting book for marriage, <em>The 100 Marriage</em> by Lawrence E. Adjah, this assessment brings the book's proven framework to life—helping you avoid misaligned expectations that can destroy your forever.
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

      {/* Referral Section */}
      <section className="py-12 px-4 bg-amber-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-800 mb-3">
              Share & Save: Invite Friends for $10 Off
            </h2>
            <p className="text-lg text-amber-700">
              Know someone who could benefit from clarity in their relationship expectations?
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-amber-800 mb-4">How It Works:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-amber-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                    <p className="text-gray-700">Invite 3 friends who could benefit from the assessment</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <p className="text-gray-700">They'll receive a personalized invitation from you with a $10 discount</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <p className="text-gray-700">You immediately get $10 off your assessment ($39 instead of $49)</p>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center">
                <div className="bg-amber-100 p-5 rounded-lg text-center">
                  <h3 className="text-amber-800 text-xl font-bold mb-2">Everyone benefits!</h3>
                  <p className="text-amber-700 mb-4">Help friends gain clarity while you save</p>
                  <Button 
                    onClick={handleStartIndividualAssessment}
                    className="bg-amber-500 hover:bg-amber-400 text-white font-medium w-full"
                  >
                    Start Assessment & Invite Friends
                  </Button>
                  <p className="text-xs text-amber-600 mt-3">
                    You'll have a chance to share with friends during the assessment process
                  </p>
                </div>
              </div>
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
          <p className="text-xl mb-4">
            Unlock insights that will transform your relationship expectations for only $49
          </p>
          <p className="text-md mb-8 text-blue-200">
            Or save $10 by inviting 3 friends who could benefit from clarity in their relationships too!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={handleStartIndividualAssessment}
              className="bg-amber-500 hover:bg-amber-400 text-white py-3 px-8 rounded-md text-base md:text-lg font-medium"
            >
              Start Individual Assessment
            </Button>
            <Button 
              onClick={handleStartCoupleAssessment}
              className="bg-purple-600 hover:bg-purple-500 text-white py-3 px-8 rounded-md text-base md:text-lg font-medium"
            >
              Start Couple Assessment
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-800 text-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm mb-2">
            By proceeding, you agree to our Terms of Service and Privacy Policy. Get ready—your personalized report will be emailed to you right after completion, guiding you toward a thriving future!
          </p>
          <div className="text-center mt-3 mb-3">
            <p className="text-white text-sm mb-2">✨ <span className="font-semibold">New:</span> Enhanced with visual psychographic profile icons! <span className="text-amber-300">View our samples:</span></p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.open('/samples', '_blank')}
                  className="text-amber-400 hover:text-amber-300 border-amber-500 hover:bg-amber-950 hover:bg-opacity-30"
                >
                  View All Samples
                </Button>
                <Button 
                  variant="link" 
                  onClick={() => window.open('/sample-results.html', '_blank')}
                  className="text-amber-400 hover:text-amber-300"
                >
                  Results
                </Button>
                <Button 
                  variant="link" 
                  onClick={() => window.open('/sample-email.html', '_blank')}
                  className="text-amber-400 hover:text-amber-300"
                >
                  Email
                </Button>
                <Button 
                  variant="link" 
                  onClick={() => window.open('/sample-pdf.html', '_blank')}
                  className="text-amber-400 hover:text-amber-300"
                >
                  PDF
                </Button>
              </div>
              
              <div className="mt-2 pt-2 border-t border-amber-700 border-opacity-30 w-full max-w-md">
                <p className="text-white text-sm mb-2"><span className="font-semibold text-purple-300">Couple Assessment:</span> <span className="text-amber-300">See how compatibility reports work</span></p>
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="link" 
                    onClick={() => window.open('/sample-couple-results.html', '_blank')}
                    className="text-purple-300 hover:text-purple-200"
                  >
                    Results
                  </Button>
                  <Button 
                    variant="link" 
                    onClick={() => window.open('/sample-couple-email.html', '_blank')}
                    className="text-purple-300 hover:text-purple-200"
                  >
                    Email
                  </Button>
                  <Button 
                    variant="link" 
                    onClick={() => window.open('/sample-couple-report.html', '_blank')}
                    className="text-purple-300 hover:text-purple-200 border border-purple-500 border-opacity-30 rounded-sm px-1.5"
                  >
                    ✨ New Discussion Guide
                  </Button>
                </div>
              </div>
            </div>
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
