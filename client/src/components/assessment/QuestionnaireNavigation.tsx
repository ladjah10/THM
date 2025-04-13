interface QuestionnaireNavigationProps {
  sections: string[];
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function QuestionnaireNavigation({ 
  sections, 
  currentSection,
  onSectionChange 
}: QuestionnaireNavigationProps) {
  return (
    <div className="mb-6 flex overflow-x-auto pb-2 scrollbar-hide">
      {sections.map((section) => (
        <button
          key={section}
          className={`px-4 py-2 text-sm font-medium rounded-md mr-2 whitespace-nowrap ${
            section === currentSection
              ? "bg-primary-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => onSectionChange(section)}
        >
          {section}
        </button>
      ))}
    </div>
  );
}
