'use client'

interface ValidationProgressBarProps {
  validFields: number
  totalFields: number
}

export default function ValidationProgressBar({
  validFields,
  totalFields,
}: ValidationProgressBarProps) {
  const percentage = (validFields / totalFields) * 100

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-gray-700">Form Completion</p>
        <p className="text-sm text-gray-600">
          {validFields} of {totalFields} fields
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            percentage === 100
              ? 'bg-green-500'
              : percentage >= 75
              ? 'bg-blue-500'
              : percentage >= 50
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
