import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    loading?: boolean
    icon?: React.ReactNode
}

const VARIANT_CLASSES: Record<Variant, string> = {
    primary:
        'border border-transparent bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
    secondary:
        'border border-line bg-white text-ink hover:bg-surface-sunken focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
    ghost:
        'border border-transparent bg-transparent text-ink hover:bg-surface-sunken focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
    danger:
        'border border-transparent bg-danger-700 text-white hover:bg-danger-800 focus-visible:ring-2 focus-visible:ring-danger-600 focus-visible:ring-offset-2',
}

export function Button({
    variant = 'primary',
    loading = false,
    icon,
    disabled,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading

    return (
        <button
            {...props}
            disabled={isDisabled}
            aria-busy={loading || undefined}
            className={[
                'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors duration-150 ease-out',
                'disabled:cursor-not-allowed disabled:opacity-70',
                VARIANT_CLASSES[variant],
                className,
            ].join(' ')}
        >
            {loading && (
                <svg
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {!loading && icon && <span className="shrink-0">{icon}</span>}
            {children}
        </button>
    )
}
