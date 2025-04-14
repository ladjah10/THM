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
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Assessment Sections</h3>
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {sections.map((section) => (
          <button
            key={section}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              section === currentSection
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
            }`}
            onClick={() => onSectionChange(section)}
          >
            {section}
          </button>
        ))}
      </div>
    </div>
  );
}
