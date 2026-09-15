import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { EyeIcon, QrCodeIcon } from 'lucide-react'

interface QrPanelProps {
    value: string
    caption: string
    /** Masque le QR tant que l'utilisateur ne l'a pas révélé (usage unique). */
    oneTime?: boolean
    badge?: string
}

export function QrPanel({ value, caption, oneTime = false, badge }: QrPanelProps) {
    const [revealed, setRevealed] = useState(!oneTime)

    return (
        <figure className="flex flex-col items-center gap-3 rounded-md border border-line bg-surface-raised p-5">
            {badge && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    <QrCodeIcon aria-hidden="true" className="h-3.5 w-3.5" />
                    {badge}
                </span>
            )}
            <div className="relative rounded-md border border-line bg-white p-4">
                <QRCodeSVG
                    value={value}
                    size={196}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                    aria-hidden={!revealed}
                    role="img"
                    aria-label={caption}
                    className={revealed ? '' : 'blur-md'}
                />
                {!revealed && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white/70 p-3">
                        <button
                            type="button"
                            onClick={() => setRevealed(true)}
                            className="inline-flex min-h-[48px] items-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand-700"
                        >
                            <EyeIcon aria-hidden="true" className="h-4 w-4" />
                            Afficher le QR code
                        </button>
                    </div>
                )}
            </div>
            <figcaption className="max-w-sm text-center text-sm leading-relaxed text-ink-muted">
                {caption}
            </figcaption>
        </figure>
    )
}
