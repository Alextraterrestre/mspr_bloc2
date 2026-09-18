import type { GeneratedPassword, LoginError, LoginPayload, TotpSecret } from '../Types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function call(fn: string, body: unknown): Promise<Response> {
    return fetch(`${API_BASE}/function/${fn}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
}

export async function generatePassword(username: string): Promise<GeneratedPassword> {
    const res = await call('generate-password', { username })
    if (!res.ok) throw new Error(`generate-password → ${res.status}`)
    const qrImage = await res.text()
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 6)
    
    return { qrImage, expiresAt: expiresAt.toISOString() }
}

export async function generateTotpSecret(username: string): Promise<TotpSecret> {
    const res = await call('generate-2fa', { username })
    if (!res.ok) throw new Error(`generate-2fa → ${res.status}`)
    const qrImage = await res.text()
    return { qrImage }
}

export async function login(payload: LoginPayload) {
    const res = await call('authenticate', payload)
    if (res.status === 200) return { username: payload.username }

    const reason = await res.text()
    if (res.status === 401) {
        const map: Record<string, LoginError['code']> = {
            invalid_credentials: 'INVALID_CREDENTIALS',
            invalid_otp: 'INVALID_TOTP',
            expired: 'ACCOUNT_EXPIRED',
        }
        throw { code: map[reason] ?? 'GATEWAY_ERROR', message: reason } satisfies LoginError
    }
    if (res.status === 404) {
        throw { code: 'ACCOUNT_NOT_FOUND', message: 'Utilisateur introuvable.' } satisfies LoginError
    }
    throw { code: 'GATEWAY_ERROR', message: `Erreur HTTP ${res.status}` } satisfies LoginError
}
