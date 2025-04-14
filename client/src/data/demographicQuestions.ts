export const demographicQuestions = {
  firstName: {
    id: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    placeholder: "Enter your first name"
  },
  lastName: {
    id: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    placeholder: "Enter your last name"
  },
  email: {
    id: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "example@email.com",
    helpText: "We'll send your assessment results to this email"
  },
  lifeStage: {
    id: "lifeStage",
    label: "Life Stage",
    type: "select",
    required: true,
    options: [
      { value: "single-no-children", label: "Single (No Children)" },
      { value: "engaged-no-children", label: "Engaged (No Children)" },
      { value: "engaged-with-children", label: "Engaged (with Children)" },
      { value: "single-with-children", label: "Single (with Children)" },
      { value: "married-no-children", label: "Married (No Children)" },
      { value: "married-with-children", label: "Married (with Children)" }
    ]
  },
  birthday: {
    id: "birthday",
    label: "Birthday",
    type: "date",
    required: true,
    helpText: "Your birth date helps us provide more relevant insights"
  },
  phone: {
    id: "phone",
    label: "Phone Number",
    type: "tel",
    required: true,
    placeholder: "(123) 456-7890"
  },
  desireChildren: {
    id: "desireChildren",
    label: "Do You Want Children?",
    type: "select",
    required: true,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  gender: {
    id: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" }
    ]
  },
  marriageStatus: {
    id: "marriageStatus",
    label: "Have You Been (Legally) Married",
    type: "select",
    required: true,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  ethnicity: {
    id: "ethnicity",
    label: "Race and Ethnicity",
    type: "multiselect",
    required: true,
    helpText: "Select all that apply",
    options: [
      { value: "american-indian", label: "American Indian or Alaska Native" },
      { value: "asian", label: "Asian" },
      { value: "black", label: "Black or African American" },
      { value: "pacific-islander", label: "Native Hawaiian or Other Pacific Islander" },
      { value: "white", label: "White" },
      { value: "hispanic", label: "Hispanic or Latino" }
    ]
  },
  hasPurchasedBook: {
    id: "hasPurchasedBook",
    label: "Have you purchased a copy of \"The 100 Marriage Decisions + Declarations You Need to Make Before Getting Married\"?",
    type: "select",
    required: true,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  purchaseDate: {
    id: "purchaseDate",
    label: "Date of Purchase (The 100 Marriage: Book)",
    type: "date",
    required: true
  },
  promoCode: {
    id: "promoCode",
    label: "Promo Code",
    type: "text",
    required: true,
    placeholder: "Enter promo code"
  },
  interestedInArrangedMarriage: {
    id: "interestedInArrangedMarriage",
    label: "Are you interested in being included in our THM Arranged Marriage pool based on your assessment score?",
    type: "select",
    required: true,
    helpText: "There is no guarantee for a match and it is considered on a rolling, real-time basis. Requires an additional $25 fee.",
    options: [
      { value: "yes", label: "Yes, I want to be considered for the THM Arranged Marriage Pool ($25)" },
      { value: "no", label: "No, not at this time" }
    ]
  }
};
