import React, { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

interface CopyFieldProps {
    label: string
    value: string
    description?: string
}

export function CopyField({ label, value, description }: CopyFieldProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
        } catch {
            /* le presse-papiers peut être indisponible dans la démo */
        }
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-ink">{label}</p>
            {description && <p className="text-sm text-ink-muted">{description}</p>}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <output className="flex min-h-[48px] flex-1 items-center break-all rounded-md border border-line bg-surface-sunken px-3.5 py-2 font-mono text-sm text-ink">
                    {value}
                </output>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:bg-surface-sunken"
                >
                    {copied ? (
                        <CheckIcon aria-hidden="true" className="h-4 w-4 text-success-700" />
                    ) : (
                        <CopyIcon aria-hidden="true" className="h-4 w-4" />
                    )}
                    {copied ? 'Copié' : 'Copier'}
                </button>
            </div>
            <p aria-live="polite" className="sr-only">
                {copied ? `${label} copié dans le presse-papiers` : null}
            </p>
        </div>
    )
}
