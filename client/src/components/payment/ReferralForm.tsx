import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReferralContact {
  firstName: string;
  lastName: string;
  email: string;
}

interface ReferralFormProps {
  onSuccess: () => void;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}

export default function ReferralForm({
  onSuccess,
  userFirstName,
  userLastName,
  userEmail
}: ReferralFormProps) {
  const emptyContact: ReferralContact = { firstName: "", lastName: "", email: "" };
  
  const [contacts, setContacts] = useState<ReferralContact[]>([
    { ...emptyContact },
    { ...emptyContact },
    { ...emptyContact }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Update a specific contact's field
  const updateContact = (index: number, field: keyof ReferralContact, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setContacts(updatedContacts);
  };
  
  // Validate all inputs
  const validateInputs = (): boolean => {
    // Check if all 3 contacts have valid information
    for (let i = 0; i < 3; i++) {
      const contact = contacts[i];
      
      if (!contact.firstName.trim() || !contact.lastName.trim()) {
        toast({
          title: "Missing Information",
          description: `Please provide full name for contact #${i + 1}.`,
          variant: "destructive"
        });
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact.email)) {
        toast({
          title: "Invalid Email",
          description: `Please provide a valid email address for contact #${i + 1}.`,
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };
  
  // Submit the referrals
  const handleSubmitReferrals = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest('POST', '/api/send-referrals', {
        referrer: {
          firstName: userFirstName,
          lastName: userLastName,
          email: userEmail
        },
        contacts
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Referrals Sent!",
          description: "Your friends have been invited and your $10 discount has been applied.",
          variant: "default"
        });
        onSuccess();
      } else {
        toast({
          title: "Failed to Send Referrals",
          description: result.message || "Please check the information and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending referrals:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your referrals. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
        <h3 className="font-medium text-amber-800 mb-2">Invite 3 Friends & Save $10</h3>
        <p className="text-sm text-amber-700">
          Share this assessment with 3 friends who could benefit from clarity in their relationship expectations. 
          They'll receive an invitation email, and you'll get $10 off your assessment fee!
        </p>
      </div>
      
      {contacts.map((contact, index) => (
        <div key={index} className="space-y-3 pt-4 pb-5 border-b border-gray-100">
          <h4 className="font-medium text-gray-700">Contact #{index + 1}</h4>
          <div className="grid grid-cols-2 gap-3">
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
      
      <div className="pt-3">
        <Button
          type="button"
          className="w-full bg-amber-500 hover:bg-amber-400 text-white"
          onClick={handleSubmitReferrals}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full"></span>
              Sending Invitations...
            </div>
          ) : (
            "Invite Friends & Get $10 Off"
          )}
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 text-center mt-2">
        <p>
          We'll send a friendly invitation email letting them know you thought they might
          benefit from this assessment. Your discount will be applied immediately.
        </p>
      </div>
    </div>
  );
}