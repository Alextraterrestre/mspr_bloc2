export type RequestState = 'idle' | 'loading' | 'success' | 'error'

export type AccountState = 'active' | 'expiring' | 'expired'

export interface ApiTrace {
  method: 'GET' | 'POST'
  endpoint: string
  gateway: string
}

export interface GeneratedPassword {
  password: string
  issuedAt: string
  expiresAt: string
  payload: string
}

export interface TotpSecret {
  secret: string
  otpauthUri: string
  issuer: string
  account: string
}

export interface LoginError {
  code: 'INVALID_CREDENTIALS' | 'INVALID_TOTP' | 'ACCOUNT_EXPIRED' | 'GATEWAY_ERROR'
  message: string
  hint?: string
}
