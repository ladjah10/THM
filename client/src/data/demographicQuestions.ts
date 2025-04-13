export const demographicQuestions = {
  gender: {
    id: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "non-binary", label: "Non-binary" },
      { value: "prefer-not-to-say", label: "Prefer not to say" }
    ]
  },
  marriageStatus: {
    id: "marriageStatus",
    label: "Marriage Status",
    type: "select",
    required: true,
    options: [
      { value: "single", label: "Single" },
      { value: "dating", label: "Dating" },
      { value: "engaged", label: "Engaged" },
      { value: "married", label: "Married" },
      { value: "divorced", label: "Divorced" },
      { value: "widowed", label: "Widowed" }
    ]
  },
  desireChildren: {
    id: "desireChildren",
    label: "Desire for Children",
    type: "select",
    required: true,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Unsure" }
    ]
  },
  ethnicity: {
    id: "ethnicity",
    label: "Race/Ethnicity",
    type: "select",
    required: true,
    options: [
      { value: "asian", label: "Asian" },
      { value: "black", label: "Black or African American" },
      { value: "hispanic", label: "Hispanic or Latino" },
      { value: "native", label: "Native American" },
      { value: "pacific", label: "Pacific Islander" },
      { value: "white", label: "White or Caucasian" },
      { value: "multiracial", label: "Multiracial" },
      { value: "other", label: "Other" },
      { value: "prefer-not-to-say", label: "Prefer not to say" }
    ]
  }
};
