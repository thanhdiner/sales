import { CheckCircle } from 'lucide-react'

export function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map(stepNum => (
        <div key={stepNum} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
              step >= stepNum
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg dark:from-[#22c55e] dark:to-[#16a34a] dark:text-[#06110a] dark:shadow-[0_12px_24px_rgba(34,197,94,0.18)]'
                : 'bg-gray-200 text-gray-500 dark:border dark:border-white/10 dark:bg-[#202327] dark:text-[#707983]'
            }`}
          >
            {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
          </div>
          {stepNum < 3 && (
            <div
              className={`w-16 h-1 mx-2 transition-all duration-300 ${
                step > stepNum
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#22c55e] dark:to-[#16a34a]'
                  : 'bg-gray-200 dark:bg-[#202327]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
