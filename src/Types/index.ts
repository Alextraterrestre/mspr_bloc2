export type RequestState = 'idle' | 'loading' | 'success' | 'error'

export type AccountState = 'active' | 'expiring' | 'expired'

export interface ApiTrace {
  method: 'GET' | 'POST'
  endpoint: string
  gateway: string
}

export interface GeneratedPassword {
  qrImage: string
  expiresAt: string
}

export interface TotpSecret {
  qrImage: string
}

export interface LoginPayload {
  username: string
  password: string
  otp: string
}

export interface LoginError {
  code: 'INVALID_CREDENTIALS' | 'INVALID_TOTP' | 'ACCOUNT_EXPIRED' | 'ACCOUNT_NOT_FOUND' | 'GATEWAY_ERROR'
  message: string
  hint?: string
}
