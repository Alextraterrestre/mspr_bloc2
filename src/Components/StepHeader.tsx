import React from 'react'

interface StepHeaderProps {
    order: string
    title: string
    description?: string
}

export function StepHeader({ order, title, description }: StepHeaderProps) {
    return (
        <header className="mb-6">
            <p className="text-sm font-semibold text-brand-700">Étape {order} sur 4</p>
            <h1 className="mt-1 text-3xl font-bold text-ink">{title}</h1>
            {description && (
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted">{description}</p>
            )}
        </header>
    )
}
