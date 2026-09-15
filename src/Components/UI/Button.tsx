import React from 'react'
import {
    AlertTriangleIcon,
    CheckCircle2Icon,
    InfoIcon,
    XOctagonIcon,
} from 'lucide-react'

type Tone = 'info' | 'success' | 'error' | 'warning'

interface AlertProps {
    tone?: Tone
    title: string
    children?: React.ReactNode
    actions?: React.ReactNode
}

const TONES: Record<Tone, { box: string; icon: React.ReactNode; text: string }> = {
    info: {
        box: 'border-brand-100 bg-brand-50',
        text: 'text-brand-800',
        icon: <InfoIcon aria-hidden="true" className="h-5 w-5 text-brand-700" />,
    },
    success: {
        box: 'border-success-200 bg-success-50',
        text: 'text-success-700',
        icon: <CheckCircle2Icon aria-hidden="true" className="h-5 w-5 text-success-700" />,
    },
    warning: {
        box: 'border-warning-200 bg-warning-50',
        text: 'text-warning-700',
        icon: <AlertTriangleIcon aria-hidden="true" className="h-5 w-5 text-warning-700" />,
    },
    error: {
        box: 'border-danger-200 bg-danger-50',
        text: 'text-danger-800',
        icon: <XOctagonIcon aria-hidden="true" className="h-5 w-5 text-danger-700" />,
    },
}

export function Alert({ tone = 'info', title, children, actions }: AlertProps) {
    const style = TONES[tone]
    const isLive = tone === 'error' || tone === 'success'

    return (
        <div
            role={tone === 'error' ? 'alert' : 'status'}
            aria-live={isLive ? 'polite' : undefined}
            className={`flex gap-3 rounded-md border p-4 ${style.box}`}
        >
            <div className="mt-0.5 shrink-0">{style.icon}</div>
            <div className="flex flex-col gap-2">
                <p className={`text-[15px] font-semibold ${style.text}`}>{title}</p>
                {children && <div className="text-sm leading-relaxed text-ink-muted">{children}</div>}
                {actions && <div className="flex flex-wrap gap-2 pt-1">{actions}</div>}
            </div>
        </div>
    )
}
