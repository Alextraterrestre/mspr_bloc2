import React, { createContext, useContext, useMemo, useState } from 'react'
import type { AccountState } from '../Types'

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
    accountState: AccountState
    forceApiError: boolean
    children: React.ReactNode
}

export function DemoProvider({ accountState, forceApiError, children }: DemoProviderProps) {
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
            accountState,
            forceApiError,
        }),
        [username, passwordIssued, totpConfigured, expiresAt, accountState, forceApiError],
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
