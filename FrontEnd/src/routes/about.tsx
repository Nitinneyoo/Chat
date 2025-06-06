import { useState } from 'react'
import { DateRangePicker } from '@/assets/date-range-picker'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
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
    <div
      className="p-6 md:p-8 bg-card rounded-xl shadow-md text-foreground flex flex-col max-w-xl mx-auto mt-6 border border-border"
      role="region"
      aria-label="About page content"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">About Page</h1>

      <div className="w-full space-y-3">
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
          <p className="text-red-500 text-sm mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
