import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    as?: 'section' | 'div' | 'aside'
    'aria-labelledby'?: string
}

export function Card({ children, className = '', as = 'section', ...rest }: CardProps) {
    const Tag = as
    return (
        <Tag
            {...rest}
            className={`rounded-lg border border-line bg-white p-6 md:p-8 ${className}`}
        >
            {children}
        </Tag>
    )
}
