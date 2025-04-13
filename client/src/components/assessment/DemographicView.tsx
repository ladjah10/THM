import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { DemographicData } from "@/types/assessment";
import { demographicQuestions } from "@/data/demographicQuestions";

interface DemographicViewProps {
  demographicData: DemographicData;
  onChange: (field: keyof DemographicData, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function DemographicView({
  demographicData,
  onChange,
  onSubmit,
  onBack
}: DemographicViewProps) {
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">About You</h3>
        <p className="text-sm text-gray-500">Please provide some information about yourself</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={demographicData.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={demographicData.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={demographicData.email}
              onChange={(e) => onChange("email", e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(123) 456-7890"
              value={demographicData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
            Gender
          </Label>
          <Select
            value={demographicData.gender}
            onValueChange={(value) => onChange("gender", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              {demographicQuestions.gender.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="marriageStatus" className="text-sm font-medium text-gray-700">
            Marriage Status
          </Label>
          <Select
            value={demographicData.marriageStatus}
            onValueChange={(value) => onChange("marriageStatus", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your status" />
            </SelectTrigger>
            <SelectContent>
              {demographicQuestions.marriageStatus.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="desireChildren" className="text-sm font-medium text-gray-700">
            Desire for Children
          </Label>
          <Select
            value={demographicData.desireChildren}
            onValueChange={(value) => onChange("desireChildren", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your preference" />
            </SelectTrigger>
            <SelectContent>
              {demographicQuestions.desireChildren.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ethnicity" className="text-sm font-medium text-gray-700">
            Race/Ethnicity
          </Label>
          <Select
            value={demographicData.ethnicity}
            onValueChange={(value) => onChange("ethnicity", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your ethnicity" />
            </SelectTrigger>
            <SelectContent>
              {demographicQuestions.ethnicity.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate" className="text-sm font-medium text-gray-700">
            Date of Purchase
          </Label>
          <Input
            id="purchaseDate"
            type="date"
            value={demographicData.purchaseDate}
            onChange={(e) => onChange("purchaseDate", e.target.value)}
            className="mt-1 block w-full"
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium"
          >
            Back to Questions
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 text-sm font-medium"
          >
            Submit & View Results
          </Button>
        </div>
      </form>
    </div>
  );
}
