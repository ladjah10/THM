interface QuestionnaireProgressProps {
  current: number;
  total: number;
  percent: number;
}

export default function QuestionnaireProgress({ current, total, percent }: QuestionnaireProgressProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium text-gray-700">Your progress</h2>
        <span className="text-sm font-medium text-gray-700">{current} of {total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary-600 h-2.5 rounded-full" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
