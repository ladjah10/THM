interface QuestionnaireProgressProps {
  current: number;
  total: number;
  percent: number;
}

export default function QuestionnaireProgress({ current, total, percent }: QuestionnaireProgressProps) {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-blue-900">Your Assessment Progress</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-700">{current}</span>
          <span className="text-xs text-gray-500">of</span>
          <span className="text-sm font-medium text-gray-700">{total}</span>
          <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {percent}%
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 mt-3">
        <div 
          className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Start</span>
        <span>Halfway</span>
        <span>Complete</span>
      </div>
    </div>
  );
}
