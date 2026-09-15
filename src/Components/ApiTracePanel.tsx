import { ServerIcon } from 'lucide-react'
import type { RequestState } from '../Types'

interface ApiTracePanelProps {
    endpoint: string
    state: RequestState
    notes: string[]
}

const STATE_LABEL: Record<RequestState, { label: string; className: string }> = {
    idle: { label: 'En attente', className: 'border-line bg-surface-sunken text-ink-muted' },
    loading: { label: 'Appel en cours', className: 'border-brand-100 bg-brand-50 text-brand-800' },
    success: { label: '200 OK', className: 'border-success-200 bg-success-50 text-success-700' },
    error: { label: 'Erreur', className: 'border-danger-200 bg-danger-50 text-danger-800' },
}

export function ApiTracePanel({ endpoint, state, notes }: ApiTracePanelProps) {
    const badge = STATE_LABEL[state]

    return (
        <aside
            aria-labelledby="api-trace-title"
            className="rounded-lg border border-line bg-white p-5"
        >
            <h2
                id="api-trace-title"
                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-muted"
            >
                <ServerIcon aria-hidden="true" className="h-4 w-4" />
                Appel backend
            </h2>

            <p className="mt-3 break-all rounded-md border border-line bg-surface-sunken px-3 py-2 font-mono text-[13px] text-ink">
                {endpoint}
            </p>

            <p className="mt-3 flex items-center gap-2 text-sm">
                <span className="text-ink-muted">État&nbsp;:</span>
                <span
                    aria-live="polite"
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${badge.className}`}
                >
                    {badge.label}
                </span>
            </p>

            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-ink-muted">
                {notes.map((note) => (
                    <li key={note}>{note}</li>
                ))}
            </ul>
        </aside>
    )
}
