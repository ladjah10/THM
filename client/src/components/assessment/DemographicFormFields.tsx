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

interface DemographicFormFieldsProps {
  demographicData: DemographicData;
  onChange: (field: keyof DemographicData, value: string | boolean) => void;
  selectedEthnicities: string[];
  onEthnicityChange: (ethnicities: string[]) => void;
}

export default function DemographicFormFields({
  demographicData,
  onChange,
  selectedEthnicities,
  onEthnicityChange
}: DemographicFormFieldsProps) {
  const handleEthnicityToggle = (ethnicity: string, checked: boolean) => {
    let updatedEthnicities;
    if (checked) {
      updatedEthnicities = [...selectedEthnicities, ethnicity];
    } else {
      updatedEthnicities = selectedEthnicities.filter(e => e !== ethnicity);
    }
    onEthnicityChange(updatedEthnicities);
    onChange('ethnicity', updatedEthnicities.join(','));
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={demographicData.firstName || ''}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={demographicData.lastName || ''}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={demographicData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={demographicData.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={demographicData.gender || ''} onValueChange={(value) => onChange('gender', value)}>
            <SelectTrigger>
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
        <div>
          <Label htmlFor="birthday">Date of Birth *</Label>
          <Input
            id="birthday"
            type="date"
            value={demographicData.birthday || ''}
            onChange={(e) => onChange('birthday', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="marriageStatus">Marriage Status *</Label>
          <Select value={demographicData.marriageStatus || ''} onValueChange={(value) => onChange('marriageStatus', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your marriage status" />
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
        <div>
          <Label htmlFor="desireChildren">Desire Children *</Label>
          <Select value={demographicData.desireChildren || ''} onValueChange={(value) => onChange('desireChildren', value)}>
            <SelectTrigger>
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
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={demographicData.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Enter your city"
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State/Province *</Label>
          <Input
            id="state"
            value={demographicData.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="Enter your state"
            required
          />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP/Postal Code</Label>
          <Input
            id="zipCode"
            value={demographicData.zipCode || ''}
            onChange={(e) => onChange('zipCode', e.target.value)}
            placeholder="Enter your ZIP code"
          />
        </div>
      </div>

      {/* Ethnicity */}
      <div>
        <Label className="text-base font-semibold">Ethnicity (Select all that apply)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {demographicQuestions.ethnicity.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`ethnicity-${option.value}`}
                checked={selectedEthnicities.includes(option.value)}
                onCheckedChange={(checked) => handleEthnicityToggle(option.value, checked as boolean)}
              />
              <Label htmlFor={`ethnicity-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Life Stage and Book */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lifeStage">Life Stage *</Label>
          <Select value={demographicData.lifeStage || ''} onValueChange={(value) => onChange('lifeStage', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your life stage" />
            </SelectTrigger>
            <SelectContent>
              {demographicQuestions.lifeStage.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="hasPurchasedBook">Have you purchased "The 100 Marriage" book? *</Label>
          <Select value={demographicData.hasPurchasedBook || ''} onValueChange={(value) => onChange('hasPurchasedBook', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {demographicQuestions.hasPurchasedBook.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}