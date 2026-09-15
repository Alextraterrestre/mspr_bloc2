import React from 'react'
import { AlertCircleIcon } from 'lucide-react'

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string
    label: string
    hint?: string
    error?: string
    mono?: boolean
    trailing?: React.ReactNode
}

export function Field({
    id,
    label,
    hint,
    error,
    mono = false,
    trailing,
    className = '',
    ...props
}: FieldProps) {
    const hintId = hint ? `${id}-hint` : undefined
    const errorId = error ? `${id}-error` : undefined

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-semibold text-ink">
                {label}
                {props.required && (
                    <span className="ml-1 font-normal text-ink-muted">(obligatoire)</span>
                )}
            </label>
            {hint && (
                <p id={hintId} className="text-sm leading-snug text-ink-muted">
                    {hint}
                </p>
            )}
            <div className="relative">
                <input
                    {...props}
                    id={id}
                    aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
                    aria-invalid={error ? true : undefined}
                    className={[
                        'min-h-[48px] w-full rounded-md border bg-white px-3.5 text-[15px] text-ink',
                        'placeholder:text-ink-subtle transition-colors duration-150 ease-out',
                        'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-subtle',
                        mono ? 'font-mono tracking-tight' : '',
                        error ? 'border-danger-700' : 'border-line hover:border-ink-subtle',
                        trailing ? 'pr-12' : '',
                        className,
                    ].join(' ')}
                />
                {trailing && (
                    <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>
                )}
            </div>
            {error && (
                <p
                    id={errorId}
                    className="flex items-start gap-1.5 text-sm font-medium text-danger-700"
                >
                    <AlertCircleIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    )
}
