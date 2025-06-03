import type React from 'react'
import { useEffect, useRef, useState } from 'react'

interface DateInputProps {
    value?: Date
    onChange: (date: Date) => void
}

interface DateParts {
    day: number
    month: number
    year: number
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
    const [date, setDate] = useState<DateParts>(() => {
        const d = value ? new Date(value) : new Date()
        return {
            day: d.getDate(),
            month: d.getMonth() + 1,
            year: d.getFullYear()
        }
    })
    const [invalidFields, setInvalidFields] = useState<Partial<Record<keyof DateParts, boolean>>>({})

    const monthRef = useRef<HTMLInputElement | null>(null)
    const dayRef = useRef<HTMLInputElement | null>(null)
    const yearRef = useRef<HTMLInputElement | null>(null)

    const initialDate = useRef<DateParts>(date)

    useEffect(() => {
        const d = value && !isNaN(value.getTime()) ? new Date(value) : new Date()
        const newDate = {
            day: d.getDate(),
            month: d.getMonth() + 1,
            year: d.getFullYear()
        }
        setDate(newDate)
        initialDate.current = newDate
    }, [value])

    const validateDate = (field: keyof DateParts, value: number): boolean => {
        if (
            (field === 'day' && (value < 1 || value > 31)) ||
            (field === 'month' && (value < 1 || value > 12)) ||
            (field === 'year' && (value < 1000 || value > 9999))
        ) {
            return false
        }

        const newDate = { ...date, [field]: value }
        const d = new Date(newDate.year, newDate.month - 1, newDate.day)
        return d.getFullYear() === newDate.year &&
            d.getMonth() + 1 === newDate.month &&
            d.getDate() === newDate.day
    }

    const handleInputChange =
        (field: keyof DateParts) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value
            const newValue = inputValue ? Number(inputValue) : NaN
            if (isNaN(newValue)) {
                setInvalidFields((prev) => ({ ...prev, [field]: true }))
                return
            }
            const isValid = validateDate(field, newValue)
            const newDate = { ...date, [field]: newValue }
            setDate(newDate)
            setInvalidFields((prev) => ({ ...prev, [field]: !isValid }))
            if (isValid) {
                onChange(new Date(newDate.year, newDate.month - 1, newDate.day))
            }
        }

    const handleBlur = (field: keyof DateParts) => (
        e: React.FocusEvent<HTMLInputElement>
    ): void => {
        if (!e.target.value) {
            setDate(initialDate.current)
            setInvalidFields((prev) => ({ ...prev, [field]: true }))
            return
        }

        const newValue = Number(e.target.value)
        const isValid = validateDate(field, newValue)

        if (!isValid) {
            setDate(initialDate.current)
            setInvalidFields((prev) => ({ ...prev, [field]: true }))
        } else {
            initialDate.current = { ...date, [field]: newValue }
            setInvalidFields((prev) => ({ ...prev, [field]: false }))
        }
    }



    return (
        <div className="flex border rounded-lg items-center text-sm px-1">
            <input
                type="number"
                ref={monthRef}
                min={1}
                max={12}
                maxLength={2}
                value={date.month}
                onChange={handleInputChange('month')}
                onFocus={(e) => {
                    if (window.innerWidth > 1024) {
                        e.target.select()
                    }
                }}
                onBlur={handleBlur('month')}
                className={`p-0 outline-none w-6 border-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${invalidFields.month ? 'border border-red-500' : ''}`}
                placeholder="M"
                aria-label="Month"
            />
            <span className="opacity-20 -mx-px">/</span>
            <input
                type="number"
                ref={dayRef}
                min={1}
                max={31}
                maxLength={2}
                value={date.day}
                onChange={handleInputChange('day')}
                // onKeyDown={handleKeyDown('day')}
                onFocus={(e) => {
                    if (window.innerWidth > 1024) {
                        e.target.select()
                    }
                }}
                onBlur={handleBlur('day')}
                className={`p-0 outline-none w-7 border-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${invalidFields.day ? 'border border-red-500' : ''}`}
                placeholder="D"
                aria-label="Day"
            />
            <span className="opacity-20 -mx-px">/</span>
            <input
                type="number"
                ref={yearRef}
                min={1000}
                max={9999}
                maxLength={4}
                value={date.year}
                onChange={handleInputChange('year')}
                // onKeyDown={handleKeyDown('year')}
                onFocus={(e) => {
                    if (window.innerWidth > 1024) {
                        e.target.select()
                    }
                }}
                onBlur={handleBlur('year')}
                className={`p-0 outline-none w-12 border-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${invalidFields.year ? 'border border-red-500' : ''}`}
                placeholder="YYYY"
                aria-label="Year"
            />
        </div>
    )
}

DateInput.displayName = 'DateInput'

export { DateInput }