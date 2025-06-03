
import {
    type FC,
    useState,
    useEffect,
    useRef,
    useCallback,
    type JSX,
} from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateInput } from "./date-input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    ChevronUpIcon,
    ChevronDownIcon,
    CheckIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
// import { Navigate } from "@tanstack/react-router";

export interface DateRangePickerProps {
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
    /** Initial value for start date */
    initialDateFrom?: Date | string;
    /** Initial value for end date */
    initialDateTo?: Date | string;
    /** Initial value for start date for compare */
    initialCompareFrom?: Date | string;
    /** Initial value for end date for compare */
    initialCompareTo?: Date | string;
    /** Alignment of popover */
    align?: "start" | "center" | "end";
    /** Option for locale */
    locale?: string;
    /** Option for showing compare feature */
    showCompare?: boolean;
}

const formatDate = (date: Date, locale: string = "en-US"): string => {
    return date.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getDateAdjustedForTimezone = (
    dateInput: Date | string | undefined,
): Date => {
    if (!dateInput) {
        return new Date();
    }

    if (typeof dateInput === "string") {
        const timestamp = Date.parse(dateInput);
        if (isNaN(timestamp)) {
            return new Date();
        }
        const date = new Date(timestamp);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    const date = new Date(dateInput);
    date.setHours(0, 0, 0, 0);
    return date;
};

interface DateRange {
    from: Date;
    to?: Date;
}

interface Preset {
    name: string;
    label: string;
}

const PRESETS: Preset[] = [
    { name: "today", label: "Today" },
    { name: "yesterday", label: "Yesterday" },
    { name: "last7", label: "Last 7 days" },
    // { name: 'last14', label: 'Last 14 days' },
    { name: "last30", label: "Last 30 days" },
    // { name: 'thisWeek', label: 'This Week' },
    { name: "lastWeek", label: "Last Week" },
    // { name: 'thisMonth', label: 'This Month' },
    { name: "lastYear", label: "Last Year" },
];

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
    filePath: string;
} = ({
    initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
    initialDateTo,
    initialCompareFrom,
    initialCompareTo,
    onUpdate,
    align = "end",
    locale = "en-US",
    showCompare = true,
}): JSX.Element => {
        const [isOpen, setIsOpen] = useState(false);

        const [range, setRange] = useState<DateRange>({
            from: getDateAdjustedForTimezone(initialDateFrom),
            to: initialDateTo
                ? getDateAdjustedForTimezone(initialDateTo)
                : getDateAdjustedForTimezone(initialDateFrom),
        });
        const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
            initialCompareFrom
                ? {
                    from: getDateAdjustedForTimezone(initialCompareFrom),
                    to: initialCompareTo
                        ? getDateAdjustedForTimezone(initialCompareTo)
                        : getDateAdjustedForTimezone(initialCompareFrom),
                }
                : undefined,
        );

        const openedRangeRef = useRef<DateRange | undefined>(undefined);
        const openedRangeCompareRef = useRef<DateRange | undefined>(undefined);

        const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
            undefined,
        );
        const [defaultMonth, setDefaultMonth] = useState<Date>(new Date());
        const [isSmallScreen, setIsSmallScreen] = useState(
            typeof window !== "undefined" ? window.innerWidth < 960 : false,
        );

        const getPresetRange = useCallback((presetName: string): DateRange => {
            const preset = PRESETS.find(({ name }) => name === presetName);
            if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
            const from = new Date();
            const to = new Date();
            const first = from.getDate() - from.getDay();

            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);

            switch (preset.name) {
                case "today":
                    break;
                case "yesterday":
                    from.setDate(from.getDate() - 1);
                    to.setDate(to.getDate() - 1);
                    break;
                case "last7":
                    from.setDate(from.getDate() - 6);
                    break;
                // case 'last14':
                //     from.setDate(from.getDate() - 13)
                //     break
                case "last30":
                    from.setDate(from.getDate() - 29);
                    break;
                // case 'thisWeek':
                //     from.setDate(first)
                //     break
                case "lastWeek":
                    from.setDate(first - 7);
                    to.setDate(first - 1);
                    break;
                // case 'thisMonth':
                //     from.setDate(1)
                //     break
                case "lastYear":
                    from.setFullYear(from.getFullYear() - 1);
                    from.setMonth(0); // Set to January
                    from.setDate(1); // Set to first day
                    to.setFullYear(from.getFullYear());
                    to.setMonth(11); // Set to December
                    to.setDate(31); // Set to last day
                    break;
            }

            return { from, to };
        }, []);

        const checkPreset = useCallback((): void => {
            for (const preset of PRESETS) {
                const presetRange = getPresetRange(preset.name);
                if (!presetRange) return;

                const normalizedRangeFrom = new Date(range.from);
                normalizedRangeFrom.setHours(0, 0, 0, 0);
                const normalizedPresetFrom = new Date(presetRange.from);
                normalizedPresetFrom.setHours(0, 0, 0, 0);

                const normalizedRangeTo = range.to
                    ? new Date(range.to)
                    : new Date(range.from);
                normalizedRangeTo.setHours(0, 0, 0, 0);
                const normalizedPresetTo = presetRange.to
                    ? new Date(presetRange.to)
                    : new Date(presetRange.from);
                normalizedPresetTo.setHours(0, 0, 0, 0);

                if (
                    normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                    normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
                ) {
                    setSelectedPreset(preset.name);
                    return;
                }
            }
            setSelectedPreset(undefined);
        }, [range, getPresetRange]);

        useEffect(() => {
            const handleResize = (): void => {
                setIsSmallScreen(window.innerWidth < 960);
            };

            let timeoutId: NodeJS.Timeout;
            const debouncedHandleResize = () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(handleResize, 200);
            };

            window.addEventListener("resize", debouncedHandleResize);
            return () => {
                window.removeEventListener("resize", debouncedHandleResize);
                clearTimeout(timeoutId);
            };
        }, []);

        const setPreset = useCallback(
            (preset: string): void => {
                const newRange = getPresetRange(preset);
                setRange(newRange);
                setDefaultMonth(newRange.from); // Update calendar view to show the selected range
                if (rangeCompare) {
                    const newRangeCompare: DateRange = {
                        from: new Date(
                            newRange.from.getFullYear() - 1,
                            newRange.from.getMonth(),
                            newRange.from.getDate(),
                        ),
                        to: newRange.to
                            ? new Date(
                                newRange.to.getFullYear() - 1,
                                newRange.to.getMonth(),
                                newRange.to.getDate(),
                            )
                            : newRange.from,
                    };
                    setRangeCompare(newRangeCompare);
                }
            },
            [getPresetRange, rangeCompare],
        );

        const resetValues = (): void => {
            const currentDate = new Date();
            setRange({
                from: getDateAdjustedForTimezone(currentDate),
                to: getDateAdjustedForTimezone(currentDate),
            });
            setRangeCompare(undefined);
            setSelectedPreset("today");
            setDefaultMonth(currentDate); // Reset calendar view to current month
        };

        // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
        useEffect(() => {
            checkPreset();
        }, [range, checkPreset]);

        const PresetButton = ({
            preset,
            label,
            isSelected,
        }: {
            preset: string;
            label: string;
            isSelected: boolean;
        }): JSX.Element => (
            <Button
                className={cn(isSelected && "pointer-events-none")}
                variant="ghost"
                onClick={() => {
                    setPreset(preset);
                }}
            >
                <>
                    <span className={cn("pr-2 opacity-0", isSelected && "opacity-70")}>
                        <CheckIcon width={18} height={18} />
                    </span>
                    {label}
                </>
            </Button>
        );

        const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
            if (a === undefined && b === undefined) return true;
            if (a === undefined || b === undefined) return false;
            return (
                a.from.getTime() === b.from.getTime() &&
                (a.to?.getTime() === b.to?.getTime() || (!a.to && !b.to))
            );
        };

        useEffect(() => {
            if (isOpen) {
                openedRangeRef.current = range;
                openedRangeCompareRef.current = rangeCompare;
            }
        }, [isOpen, range, rangeCompare]);

        return (
            <Popover
                modal={true}
                open={isOpen}
                onOpenChange={(open: boolean) => {
                    if (!open) {
                        resetValues();
                    }
                    setIsOpen(open);
                }}
            >
                <PopoverTrigger asChild>
                    <Button size={"lg"} variant="outline">
                        <div className="text-right">
                            <div className="py-1">
                                <div>{`${formatDate(range.from, locale)}${range.to ? ` - ${formatDate(range.to, locale)}` : ""}`}</div>
                            </div>
                            {rangeCompare != null && (
                                <div className="opacity-60 text-xs -mt-1">
                                    <>
                                        vs. {formatDate(rangeCompare.from, locale)}
                                        {rangeCompare.to != null
                                            ? ` - ${formatDate(rangeCompare.to, locale)}`
                                            : ""}
                                    </>
                                </div>
                            )}
                        </div>
                        <div className="pl-1 opacity-60 -mr-2 scale-125">
                            {isOpen ? (
                                <ChevronUpIcon width={24} />
                            ) : (
                                <ChevronDownIcon width={24} />
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent align={align} className="w-auto">
                    <div className="flex py-2">
                        {!isSmallScreen && (
                            <div className="flex flex-col items-start gap-1 pl-2 pr-6 pb-6">
                                <div className="flex w-full flex-col items-start gap-1">
                                    {PRESETS.map((preset) => (
                                        <PresetButton
                                            key={preset.name}
                                            preset={preset.name}
                                            label={preset.label}
                                            isSelected={selectedPreset === preset.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex">
                            <div className="flex flex-col">
                                <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-4 lg:pb-0">
                                    {showCompare && (
                                        <div className="flex items-center space-x-2 pr-4 py-1">
                                            <Switch
                                                defaultChecked={Boolean(rangeCompare)}
                                                onCheckedChange={(checked: boolean) => {
                                                    if (checked) {
                                                        if (!range.to) {
                                                            setRange({
                                                                from: range.from,
                                                                to: range.from,
                                                            });
                                                        }
                                                        setRangeCompare({
                                                            from: new Date(
                                                                range.from.getFullYear(),
                                                                range.from.getMonth(),
                                                                range.from.getDate() - 365,
                                                            ),
                                                            to: range.to
                                                                ? new Date(
                                                                    range.to.getFullYear() - 1,
                                                                    range.to.getMonth(),
                                                                    range.to.getDate(),
                                                                )
                                                                : new Date(
                                                                    range.from.getFullYear() - 1,
                                                                    range.from.getMonth(),
                                                                    range.from.getDate(),
                                                                ),
                                                        });
                                                    } else {
                                                        setRangeCompare(undefined);
                                                    }
                                                }}
                                                id="compare-mode"
                                                aria-label="Toggle compare mode"
                                            />
                                            <Label htmlFor="compare-mode">Compare</Label>
                                        </div>
                                    )}
                                </div>
                                {isSmallScreen && (
                                    <Select
                                        defaultValue={selectedPreset}
                                        onValueChange={(value) => {
                                            setPreset(value);
                                        }}
                                    >
                                        <SelectTrigger className="w-[180px] mx-auto mb-2">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRESETS.map((preset) => (
                                                <SelectItem key={preset.name} value={preset.name}>
                                                    {preset.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <div>
                                    <Calendar
                                        mode="range"
                                        onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                                            if (value?.from) {
                                                setRange({
                                                    from: value.from,
                                                    to: value?.to || value.from,
                                                });
                                            }
                                        }}
                                        selected={range}
                                        numberOfMonths={1}
                                        defaultMonth={defaultMonth}
                                        showOutsideDays
                                        toDate={new Date()}
                                        fixedWeeks
                                        disabled={(date) => {
                                            const today = new Date();
                                            today.setHours(23, 59, 59, 999);
                                            return date > today;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 py-2 pr-4 justify-between">
                        <div className="flex flex-col gap-2 justify-items-start">
                            <div className="flex gap-2">
                                <DateInput
                                    value={range.from}
                                    onChange={(date) => {
                                        const toDate =
                                            range.to == null || date > range.to ? date : range.to;
                                        setRange((prevRange) => ({
                                            ...prevRange,
                                            from: date,
                                            to: toDate,
                                        }));
                                    }}
                                />
                                <div className="py-1">-</div>
                                <DateInput
                                    value={range.to}
                                    onChange={(date) => {
                                        const fromDate = date < range.from ? date : range.from;
                                        setRange((prevRange) => ({
                                            ...prevRange,
                                            from: fromDate,
                                            to: date,
                                        }));
                                    }}
                                />
                            </div>
                            {rangeCompare != null && (
                                <div className="flex gap-2">
                                    <DateInput
                                        value={rangeCompare?.from}
                                        onChange={(date) => {
                                            if (rangeCompare) {
                                                const compareToDate =
                                                    rangeCompare.to == null || date > rangeCompare.to
                                                        ? date
                                                        : rangeCompare.to;
                                                setRangeCompare((prevRangeCompare) => ({
                                                    ...prevRangeCompare,
                                                    from: date,
                                                    to: compareToDate,
                                                }));
                                            } else {
                                                setRangeCompare({
                                                    from: date,
                                                    to: new Date(),
                                                });
                                            }
                                        }}
                                    />
                                    <div className="py-1">-</div>
                                    <DateInput
                                        value={rangeCompare?.to}
                                        onChange={(date) => {
                                            if (rangeCompare?.from) {
                                                const compareFromDate =
                                                    date < rangeCompare.from ? date : rangeCompare.from;
                                                setRangeCompare({
                                                    ...rangeCompare,
                                                    from: compareFromDate,
                                                    to: date,
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button
                                onClick={() => {
                                    // setIsOpen(false)

                                    resetValues();
                                }}
                                variant="destructive"
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsOpen(false);
                                    if (
                                        !areRangesEqual(range, openedRangeRef.current) ||
                                        !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
                                    ) {
                                        onUpdate?.({ range, rangeCompare });
                                    }
                                }}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    };

DateRangePicker.displayName = "DateRangePicker";
DateRangePicker.filePath =
    "libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx";
