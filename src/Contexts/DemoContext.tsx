import React, { createContext, useContext, useMemo, useState } from 'react'
import type { AccountState } from '../Types'

function deriveAccountState(expiresAt: string | null): AccountState {
    if (!expiresAt) return 'active'
    const now = Date.now()
    const expiry = new Date(expiresAt).getTime()
    const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000
    if (expiry <= now) return 'expired'
    if (expiry - now <= fifteenDaysMs) return 'expiring'
    return 'active'
}

interface DemoState {
    username: string
    setUsername: (value: string) => void
    passwordIssued: boolean
    setPasswordIssued: (value: boolean) => void
    totpConfigured: boolean
    setTotpConfigured: (value: boolean) => void
    expiresAt: string | null
    setExpiresAt: (value: string | null) => void
    accountState: AccountState
    forceApiError: boolean
}

const DemoContext = createContext<DemoState | null>(null)

interface DemoProviderProps {
    forceApiError?: boolean
    children: React.ReactNode
}

export function DemoProvider({ forceApiError = false, children }: DemoProviderProps) {
    const [username, setUsername] = useState('')
    const [passwordIssued, setPasswordIssued] = useState(false)
    const [totpConfigured, setTotpConfigured] = useState(false)
    const [expiresAt, setExpiresAt] = useState<string | null>(null)

    const value = useMemo<DemoState>(
        () => ({
            username,
            setUsername,
            passwordIssued,
            setPasswordIssued,
            totpConfigured,
            setTotpConfigured,
            expiresAt,
            setExpiresAt,
            accountState: deriveAccountState(expiresAt),
            forceApiError,
        }),
        [username, passwordIssued, totpConfigured, expiresAt, forceApiError],
    )

    return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(): DemoState {
    const ctx = useContext(DemoContext)
    if (!ctx) {
        throw new Error('useDemo doit être utilisé dans un DemoProvider')
    }
    return ctx
}
