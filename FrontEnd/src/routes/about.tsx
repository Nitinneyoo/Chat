import { useState } from 'react'
import { DateRangePicker } from '@/assets/date-range-picker'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)  // Reset time to start of day
    return { from: today }
  })
  const [error, setError] = useState<string | null>(null)

  const handleDateChange = (values: { range: { from: Date; to?: Date }; rangeCompare?: { from: Date; to?: Date } }) => {
    if (values.range.to && values.range.from <= values.range.to) {
      setDateRange(values.range)
      setError(null)
    } else {
      setError('The end date must be after the start date.')
    }
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: Using div with ARIA role and label for better semantics
    <div className="p-4 text-foreground flex flex-col max-w-md mx-auto" role="region" aria-label="About page content">
      <h1 className="text-xl font-semibold mb-4">About Page</h1>
      <div className="w-full">
        <DateRangePicker
          onUpdate={handleDateChange}
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          align="start"
          locale="en-GB"
          showCompare={false}
          aria-label="Select date range"
        />
        {error && (
          <p className="text-red-500 text-sm mt-2" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}