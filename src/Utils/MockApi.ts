import type { GeneratedPassword, LoginError, TotpSecret } from '../types'

const PASSWORD_ALPHABET =
    'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*?-_=+'
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function randomFrom(alphabet: string, length: number): string {
    let out = ''
    for (let i = 0; i < length; i += 1) {
        out += alphabet[Math.floor(Math.random() * alphabet.length)]
    }
    return out
}

export function addMonths(from: Date, months: number): Date {
    const next = new Date(from)
    next.setMonth(next.getMonth() + months)
    return next
}

/** POST /function/generate-password — OpenFaaS */
export async function generatePassword(
    username: string,
    forceError = false,
): Promise<GeneratedPassword> {
    await wait(900)
    if (forceError) {
        throw new Error("La fonction generate-password n'a pas répondu (502 Bad Gateway).")
    }
    const password = randomFrom(PASSWORD_ALPHABET, 24)
    const issuedAt = new Date()
    return {
        password,
        issuedAt: issuedAt.toISOString(),
        expiresAt: addMonths(issuedAt, 6).toISOString(),
        payload: JSON.stringify({ u: username, p: password, v: 1 }),
    }
}

/** POST /function/generate-totp-secret — OpenFaaS */
export async function generateTotpSecret(
    username: string,
    forceError = false,
): Promise<TotpSecret> {
    await wait(800)
    if (forceError) {
        throw new Error("La fonction generate-totp-secret n'a pas répondu (502 Bad Gateway).")
    }
    const secret = randomFrom(BASE32_ALPHABET, 32)
    const issuer = 'OpenFaaS-PoC'
    const account = username || 'utilisateur'
    return {
        secret,
        issuer,
        account,
        otpauthUri: `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(
            account,
        )}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`,
    }
}

export interface LoginPayload {
    username: string
    password: string
    totp: string
}

/** POST /function/auth-login — OpenFaaS */
export async function login(
    payload: LoginPayload,
    options: { forceExpired?: boolean; forceError?: boolean } = {},
): Promise<{ username: string }> {
    await wait(1100)

    if (options.forceError) {
        throw {
            code: 'GATEWAY_ERROR',
            message: "Le service d'authentification est injoignable.",
            hint: 'Vérifiez que la fonction auth-login est déployée sur la gateway OpenFaaS.',
        } satisfies LoginError
    }

    if (options.forceExpired || payload.username.trim().toLowerCase() === 'expire') {
        throw {
            code: 'ACCOUNT_EXPIRED',
            message: 'Ce compte a dépassé la durée de validité de 6 mois.',
            hint: 'La connexion est bloquée tant que le mot de passe et le secret TOTP ne sont pas régénérés.',
        } satisfies LoginError
    }

    if (payload.password.length < 12) {
        throw {
            code: 'INVALID_CREDENTIALS',
            message: 'Identifiant ou mot de passe incorrect.',
            hint: 'Le mot de passe généré contient 24 caractères : collez-le sans espace avant ni après.',
        } satisfies LoginError
    }

    if (!/^\d{6}$/.test(payload.totp) || payload.totp === '000000') {
        throw {
            code: 'INVALID_TOTP',
            message: 'Code à 6 chiffres invalide ou expiré.',
            hint: 'Chaque code est valable 30 secondes. Attendez le suivant dans votre application.',
        } satisfies LoginError
    }

    return { username: payload.username }
}

/** POST /function/rotate-credentials — OpenFaaS */
export async function finalizeRotation(forceError = false): Promise<{ expiresAt: string }> {
    await wait(700)
    if (forceError) {
        throw new Error("La fonction rotate-credentials a renvoyé une erreur (500).")
    }
    return { expiresAt: addMonths(new Date(), 6).toISOString() }
}
