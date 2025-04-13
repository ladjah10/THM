import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>(
    demographicData.ethnicity ? demographicData.ethnicity.split(',') : []
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // Handle ethnicity checkbox changes
  const handleEthnicityChange = (value: string, isChecked: boolean) => {
    setSelectedEthnicities(prev => {
      const updatedValues = isChecked 
        ? [...prev, value] 
        : prev.filter(item => item !== value);
      
      // Update the parent component with joined string
      onChange("ethnicity", updatedValues.join(','));
      return updatedValues;
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">About You</h3>
        <p className="text-sm text-gray-500">Please provide some information before taking the assessment</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              {demographicQuestions.firstName.label}
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder={demographicQuestions.firstName.placeholder}
              value={demographicData.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              required={demographicQuestions.firstName.required}
              className="mt-1 block w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              {demographicQuestions.lastName.label}
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder={demographicQuestions.lastName.placeholder}
              value={demographicData.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              required={demographicQuestions.lastName.required}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              {demographicQuestions.email.label}
            </Label>
            {demographicQuestions.email.helpText && (
              <p className="text-xs text-gray-500">{demographicQuestions.email.helpText}</p>
            )}
            <Input
              id="email"
              type="email"
              placeholder={demographicQuestions.email.placeholder}
              value={demographicData.email}
              onChange={(e) => onChange("email", e.target.value)}
              required={demographicQuestions.email.required}
              className="mt-1 block w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              {demographicQuestions.phone.label}
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder={demographicQuestions.phone.placeholder}
              value={demographicData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              required={demographicQuestions.phone.required}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="desireChildren" className="text-sm font-medium text-gray-700">
            {demographicQuestions.desireChildren.label}
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
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
            {demographicQuestions.gender.label}
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
            {demographicQuestions.marriageStatus.label}
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
          <Label className="text-sm font-medium text-gray-700">
            {demographicQuestions.ethnicity.label}
          </Label>
          {demographicQuestions.ethnicity.helpText && (
            <p className="text-xs text-gray-500">{demographicQuestions.ethnicity.helpText}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {demographicQuestions.ethnicity.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`ethnicity-${option.value}`}
                  checked={selectedEthnicities.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleEthnicityChange(option.value, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`ethnicity-${option.value}`}
                  className="text-sm font-normal text-gray-700"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate" className="text-sm font-medium text-gray-700">
            {demographicQuestions.purchaseDate.label}
          </Label>
          <Input
            id="purchaseDate"
            type="date"
            value={demographicData.purchaseDate}
            onChange={(e) => onChange("purchaseDate", e.target.value)}
            required={demographicQuestions.purchaseDate.required}
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
            Start Assessment
          </Button>
        </div>
      </form>
    </div>
  );
}
