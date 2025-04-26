import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface ReferralContact {
  firstName: string;
  lastName: string;
  email: string;
}

export default function InviteFriends() {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  
  const emptyContact: ReferralContact = { firstName: "", lastName: "", email: "" };
  
  const [contacts, setContacts] = useState<ReferralContact[]>([
    { ...emptyContact },
    { ...emptyContact },
    { ...emptyContact }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  
  // Effect to get user info from localStorage if available
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsedInfo = JSON.parse(storedUserInfo);
        setUserInfo({
          firstName: parsedInfo.firstName || "",
          lastName: parsedInfo.lastName || "",
          email: parsedInfo.email || ""
        });
      } catch (e) {
        console.error("Error parsing user info from localStorage:", e);
      }
    }
  }, []);
  
  // Update a specific contact's field
  const updateContact = (index: number, field: keyof ReferralContact, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setContacts(updatedContacts);
  };
  
  // Update user information
  const updateUserInfo = (field: keyof typeof userInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };
  
  // Validate all inputs
  const validateInputs = (): boolean => {
    // Check if user info is valid
    if (!userInfo.firstName.trim() || !userInfo.lastName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your full name.",
        variant: "destructive"
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      toast({
        title: "Invalid Email",
        description: "Please provide a valid email address for yourself.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if at least one contact has valid information
    let validContactCount = 0;
    const contactEmails = new Set<string>();
    
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      
      // Skip completely empty contacts
      if (!contact.firstName.trim() && !contact.lastName.trim() && !contact.email.trim()) {
        continue;
      }
      
      if (!contact.firstName.trim() || !contact.lastName.trim()) {
        toast({
          title: "Missing Information",
          description: `Please provide full name for contact #${i + 1}.`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!emailRegex.test(contact.email)) {
        toast({
          title: "Invalid Email",
          description: `Please provide a valid email address for contact #${i + 1}.`,
          variant: "destructive"
        });
        return false;
      }
      
      // Check if the contact email is the same as the user's email
      if (contact.email.toLowerCase() === userInfo.email.toLowerCase()) {
        toast({
          title: "Invalid Referral",
          description: "You cannot refer yourself. Please provide a different email address.",
          variant: "destructive"
        });
        return false;
      }
      
      // Check for duplicate emails among contacts
      const lowerCaseEmail = contact.email.toLowerCase();
      if (contactEmails.has(lowerCaseEmail)) {
        toast({
          title: "Duplicate Email",
          description: `You've entered the same email address (${contact.email}) more than once. Please provide unique email addresses.`,
          variant: "destructive"
        });
        return false;
      }
      
      contactEmails.add(lowerCaseEmail);
      validContactCount++;
    }
    
    if (validContactCount === 0) {
      toast({
        title: "No Contacts",
        description: "Please provide information for at least one contact.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  // Submit the referrals
  const handleSubmitReferrals = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Save user info to localStorage for future use
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    // Filter out completely empty contacts
    const validContacts = contacts.filter(contact => 
      contact.firstName.trim() && contact.lastName.trim() && contact.email.trim()
    );
    
    try {
      const response = await apiRequest('POST', '/api/send-referrals', {
        referrer: {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email
        },
        contacts: validContacts
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Invitations Sent!",
          description: "Your friends have been invited successfully.",
          variant: "default"
        });
        setIsSent(true);
      } else {
        toast({
          title: "Failed to Send Invitations",
          description: result.message || "Please check the information and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending referrals:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your invitations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form to send more invitations
  const handleSendMore = () => {
    setContacts([
      { ...emptyContact },
      { ...emptyContact },
      { ...emptyContact }
    ]);
    setIsSent(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-900">The 100 Marriage Assessment - Series 1</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <span className="text-gray-700 hover:text-blue-700 font-medium cursor-pointer">Home</span>
            </Link>
            <a 
              href="https://lawrenceadjah.com/about" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-700 font-medium"
            >
              About
            </a>
            <a 
              href="https://lawrenceadjah.com/the100marriagebook" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-700 font-medium"
            >
              Purchase Book
            </a>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 md:p-8">
          {!isSent ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
                  Invite Friends to Take The 100 Marriage Assessment
                </h1>
                <p className="text-gray-700 max-w-2xl mx-auto">
                  Share this assessment with friends who could benefit from clarity in their relationship expectations.
                  They'll receive a personalized invitation from you.
                </p>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                <h3 className="font-medium text-amber-800 mb-2">Why Share This Assessment?</h3>
                <p className="text-sm text-amber-700 mb-3">
                  Misaligned expectations are the leading cause of relational disappointment. This assessment helps individuals
                  and couples understand what they truly expect from marriage before saying "I do."
                </p>
                <p className="text-sm text-amber-700">
                  Your friends will thank you for helping them gain clarity in their relationship journey.
                </p>
              </div>
              
              <div className="space-y-6">
                {/* Your Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-blue-800 mb-4">Your Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm">
                        Your First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Your First Name"
                        value={userInfo.firstName}
                        onChange={(e) => updateUserInfo("firstName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm">
                        Your Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Your Last Name"
                        value={userInfo.lastName}
                        onChange={(e) => updateUserInfo("lastName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="email" className="text-sm">
                      Your Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={userInfo.email}
                      onChange={(e) => updateUserInfo("email", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We'll use this to let your friends know who invited them.
                    </p>
                  </div>
                </div>
                
                {/* Friend Information */}
                <div>
                  <h2 className="text-xl font-semibold text-blue-800 mb-4">Who Would You Like to Invite?</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    You can invite up to 3 friends. Fill in as many as you'd like.
                  </p>
                  
                  {contacts.map((contact, index) => (
                    <div key={index} className="space-y-3 pt-4 pb-5 border-b border-gray-100">
                      <h4 className="font-medium text-gray-700">Friend #{index + 1}</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`firstName-${index}`} className="text-sm">
                            First Name
                          </Label>
                          <Input
                            id={`firstName-${index}`}
                            type="text"
                            placeholder="First Name"
                            value={contact.firstName}
                            onChange={(e) => updateContact(index, "firstName", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`lastName-${index}`} className="text-sm">
                            Last Name
                          </Label>
                          <Input
                            id={`lastName-${index}`}
                            type="text"
                            placeholder="Last Name"
                            value={contact.lastName}
                            onChange={(e) => updateContact(index, "lastName", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`email-${index}`} className="text-sm">
                          Email Address
                        </Label>
                        <Input
                          id={`email-${index}`}
                          type="email"
                          placeholder="email@example.com"
                          value={contact.email}
                          onChange={(e) => updateContact(index, "email", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-6">
                  <Button
                    type="button"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3"
                    onClick={handleSubmitReferrals}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full"></span>
                        Sending Invitations...
                      </div>
                    ) : (
                      "Send Invitations"
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-3">Invitations Sent Successfully!</h2>
              <p className="text-gray-700 mb-6 max-w-md mx-auto">
                Your friends will receive an email invitation to take The 100 Marriage Assessment.
                Thank you for sharing this valuable resource!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="bg-amber-500 hover:bg-amber-400 text-white"
                  onClick={handleSendMore}
                >
                  Invite More Friends
                </Button>
                <Link href="/">
                  <Button variant="outline">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} The 100 Marriage. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}