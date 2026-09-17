import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon, LogInIcon, RotateCcwIcon } from 'lucide-react'
import { StepHeader } from '../Components/StepHeader'
import { Alert } from '../Components/UI/Alerts'
import { Button } from '../Components/UI/Button'
import { Card } from '../Components/UI/Card'
import { Field } from '../Components/UI/Fields'
import { useDemo } from '../Contexts/DemoContext'
import { login } from '../Utils/Api'
import type { LoginError, RequestState } from '../Types'

export function Login() {
    const navigate = useNavigate()
    const { username, setUsername } = useDemo()
    const [password, setPassword] = useState('')
    const [totp, setTotp] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [state, setState] = useState<RequestState>('idle')
    const [error, setError] = useState<LoginError | null>(null)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setError(null)
        setState('loading')
        try {
            await login({ username, password, otp: totp })
            setState('success')
        } catch (err) {
            setState('error')
            setError(err as LoginError)
        }
    }

    const isExpired = error?.code === 'ACCOUNT_EXPIRED'
    const disabled = state === 'loading'

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div>
                <StepHeader
                    order="3"
                    title="Connexion"
                    description="Les trois facteurs sont envoyés en un seul appel à la fonction d'authentification : identifiant, mot de passe de 24 caractères et code TOTP courant."
                />

                <Card aria-labelledby="titre-connexion">
                    <h2 id="titre-connexion" className="text-xl font-semibold text-ink">
                        Authentification
                    </h2>

                    {state === 'success' ? (
                        <div className="mt-5 flex flex-col gap-5">
                            <Alert tone="success" title="Connexion réussie">
                                Session ouverte pour <strong>{username}</strong>. Le jeton est valable 15 minutes
                                et le compte reste valide 6 mois après la dernière rotation.
                            </Alert>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="secondary" onClick={() => setState('idle')}>
                                    Revenir au formulaire
                                </Button>
                                <Button variant="ghost" onClick={() => navigate('/renouvellement')}>
                                    Voir l'écran de renouvellement
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-5">
                            {isExpired && error && (
                                <Alert
                                    tone="error"
                                    title="Compte expiré — connexion bloquée"
                                    actions={
                                        <Button
                                            variant="danger"
                                            onClick={() => navigate('/renouvellement')}
                                            icon={<RotateCcwIcon aria-hidden="true" className="h-4 w-4" />}
                                        >
                                            Renouveler mes identifiants
                                        </Button>
                                    }
                                >
                                    {error.message} {error.hint}
                                </Alert>
                            )}

                            {!isExpired && error && (
                                <Alert tone="error" title={error.message}>
                                    {error.hint}
                                </Alert>
                            )}

                            <Field
                                id="login-username"
                                label="Nom d'utilisateur"
                                autoComplete="username"
                                required
                                disabled={disabled}
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="ex. m.dupont"
                                hint="Identifiant du compte créé à l'étape 1."
                            />

                            <Field
                                id="login-password"
                                label="Mot de passe"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                mono
                                disabled={disabled}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                hint="24 caractères, issus du QR code de création de compte."
                                trailing={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-pressed={showPassword}
                                        className="mr-1 flex h-10 w-10 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 ease-out hover:bg-surface-sunken"
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon aria-hidden="true" className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon aria-hidden="true" className="h-5 w-5" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                        </span>
                                    </button>
                                }
                            />

                            <Field
                                id="login-totp"
                                label="Code de double authentification"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                required
                                mono
                                disabled={disabled}
                                value={totp}
                                onChange={(event) => setTotp(event.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                hint="Code à 6 chiffres affiché par votre application d'authentification."
                                className="max-w-50 text-lg tracking-[0.35em]"
                            />

                            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
                                <Button
                                    type="submit"
                                    loading={disabled}
                                    icon={<LogInIcon aria-hidden="true" className="h-5 w-5" />}
                                >
                                    {disabled ? 'Vérification…' : 'Se connecter'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => navigate('/renouvellement')}
                                >
                                    Mot de passe expiré ?
                                </Button>
                            </div>

                            {disabled && (
                                <p aria-live="polite" className="text-sm text-ink-muted">
                                    Vérification des identifiants et du code TOTP en cours…
                                </p>
                            )}
                        </form>
                    )}
                </Card>
            </div>
        </div>
    )
}
