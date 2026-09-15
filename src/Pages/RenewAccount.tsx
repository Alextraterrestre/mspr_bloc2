import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2Icon, KeyRoundIcon, SmartphoneIcon } from 'lucide-react'
import { StepHeader } from '../Components/StepHeader'
import { ApiTracePanel } from '../Components/ApiTracePanel'
import { QrPanel } from '../Components/QrPanel'
import { Alert } from '../Components/UI/Alerts'
import { Button } from '../Components/UI/Button'
import { Card } from '../Components/UI/Card'
import { useDemo } from '../Contexts/DemoContext'
import { finalizeRotation, generatePassword, generateTotpSecret } from '../Utils/MockApi'
import type { GeneratedPassword, RequestState, TotpSecret } from '../Types'

export function RenewAccount() {
    const navigate = useNavigate()
    const { username, forceApiError, setExpiresAt } = useDemo()

    const [pwdState, setPwdState] = useState<RequestState>('idle')
    const [pwd, setPwd] = useState<GeneratedPassword | null>(null)
    const [pwdError, setPwdError] = useState<string | undefined>()

    const [totpState, setTotpState] = useState<RequestState>('idle')
    const [totp, setTotp] = useState<TotpSecret | null>(null)
    const [totpError, setTotpError] = useState<string | undefined>()

    const [finalState, setFinalState] = useState<RequestState>('idle')
    const [newExpiry, setNewExpiry] = useState<string | null>(null)

    const globalState: RequestState =
        pwdState === 'loading' || totpState === 'loading' || finalState === 'loading'
            ? 'loading'
            : pwdState === 'error' || totpState === 'error' || finalState === 'error'
                ? 'error'
                : finalState === 'success'
                    ? 'success'
                    : 'idle'

    const rotatePassword = async () => {
        setPwdError(undefined)
        setPwdState('loading')
        try {
            setPwd(await generatePassword(username || 'utilisateur', forceApiError))
            setPwdState('success')
        } catch (error) {
            setPwdState('error')
            setPwdError(error instanceof Error ? error.message : 'Erreur inattendue.')
        }
    }

    const rotateTotp = async () => {
        setTotpError(undefined)
        setTotpState('loading')
        try {
            setTotp(await generateTotpSecret(username || 'utilisateur', forceApiError))
            setTotpState('success')
        } catch (error) {
            setTotpState('error')
            setTotpError(error instanceof Error ? error.message : 'Erreur inattendue.')
        }
    }

    const finalize = async () => {
        setFinalState('loading')
        try {
            const data = await finalizeRotation(forceApiError)
            setNewExpiry(data.expiresAt)
            setExpiresAt(data.expiresAt)
            setFinalState('success')
        } catch {
            setFinalState('error')
        }
    }

    const bothDone = pwdState === 'success' && totpState === 'success'

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div>
                <StepHeader
                    order="4"
                    title="Renouvellement des identifiants"
                    description="Après 6 mois, la connexion est bloquée tant que le mot de passe et le secret TOTP n'ont pas été régénérés. Les deux opérations sont indépendantes mais toutes deux obligatoires."
                />

                <div className="flex flex-col gap-6">
                    <Alert tone="error" title="Compte expiré depuis plus de 6 mois">
                        L'accès de <strong>{username || 'ce compte'}</strong> est suspendu. Régénérez les deux
                        secrets ci-dessous pour réactiver la connexion&nbsp;; les anciens identifiants sont
                        révoqués immédiatement.
                    </Alert>

                    <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
                        <Card aria-labelledby="rotation-mdp" className="flex h-full flex-col">
                            <h2 id="rotation-mdp" className="text-lg font-semibold text-ink">
                                1. Nouveau mot de passe
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                                Génère un mot de passe de 24 caractères et invalide l'ancien.
                            </p>
                            <div className="mt-4">
                                <Button
                                    onClick={rotatePassword}
                                    loading={pwdState === 'loading'}
                                    variant={pwdState === 'success' ? 'secondary' : 'primary'}
                                    icon={<KeyRoundIcon aria-hidden="true" className="h-5 w-5" />}
                                >
                                    {pwdState === 'success' ? 'Régénérer à nouveau' : 'Régénérer le mot de passe'}
                                </Button>
                            </div>
                            <div className="mt-4 flex flex-col gap-4">
                                {pwdState === 'error' && (
                                    <Alert tone="error" title="Rotation du mot de passe impossible">
                                        {pwdError}
                                    </Alert>
                                )}
                                {pwdState === 'success' && pwd && (
                                    <QrPanel
                                        value={pwd.payload}
                                        oneTime
                                        badge="Nouveau mot de passe"
                                        caption="QR code à usage unique contenant le nouveau mot de passe de 24 caractères."
                                    />
                                )}
                            </div>
                            <div className="mt-auto" />
                        </Card>

                        <Card aria-labelledby="rotation-totp" className="flex h-full flex-col">
                            <h2 id="rotation-totp" className="text-lg font-semibold text-ink">
                                2. Nouveau secret TOTP
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                                Remplace l'entrée existante dans votre application d'authentification.
                            </p>
                            <div className="mt-4">
                                <Button
                                    onClick={rotateTotp}
                                    loading={totpState === 'loading'}
                                    variant={totpState === 'success' ? 'secondary' : 'primary'}
                                    icon={<SmartphoneIcon aria-hidden="true" className="h-5 w-5" />}
                                >
                                    {totpState === 'success' ? 'Régénérer à nouveau' : 'Régénérer le secret TOTP'}
                                </Button>
                            </div>
                            <div className="mt-4 flex flex-col gap-4">
                                {totpState === 'error' && (
                                    <Alert tone="error" title="Rotation du secret TOTP impossible">
                                        {totpError}
                                    </Alert>
                                )}
                                {totpState === 'success' && totp && (
                                    <QrPanel
                                        value={totp.otpauthUri}
                                        badge="Nouveau QR code TOTP"
                                        caption="Supprimez l'ancienne entrée dans Google Authenticator, puis scannez ce nouveau QR code."
                                    />
                                )}
                            </div>
                            <div className="mt-auto" />
                        </Card>
                    </div>

                    <Card aria-labelledby="finaliser">
                        <h2 id="finaliser" className="text-lg font-semibold text-ink">
                            3. Finaliser le renouvellement
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
                            Disponible une fois les deux secrets régénérés. Réactive le compte pour 6 mois.
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <Button
                                onClick={finalize}
                                disabled={!bothDone || finalState === 'success'}
                                loading={finalState === 'loading'}
                                icon={<CheckCircle2Icon aria-hidden="true" className="h-5 w-5" />}
                            >
                                Réactiver le compte
                            </Button>
                            {!bothDone && (
                                <p className="text-sm text-ink-muted">
                                    Action désactivée : régénérez d'abord le mot de passe et le secret TOTP.
                                </p>
                            )}
                        </div>

                        {finalState === 'error' && (
                            <div className="mt-4">
                                <Alert tone="error" title="Réactivation refusée par le backend">
                                    La fonction <code className="font-mono">rotate-credentials</code> a renvoyé une
                                    erreur. Les nouveaux secrets restent valables, relancez la finalisation.
                                </Alert>
                            </div>
                        )}

                        {finalState === 'success' && newExpiry && (
                            <div className="mt-4">
                                <Alert
                                    tone="success"
                                    title="Compte réactivé"
                                    actions={
                                        <Button variant="secondary" onClick={() => navigate('/connexion')}>
                                            Retourner à la connexion
                                        </Button>
                                    }
                                >
                                    Prochaine expiration le{' '}
                                    <strong>
                                        {new Date(newExpiry).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </strong>
                                    . Un rappel sera envoyé 15 jours avant.
                                </Alert>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <ApiTracePanel
                endpoint="POST /function/rotate-credentials"
                state={globalState}
                notes={[
                    'Pré-requis : generate-password + generate-totp-secret.',
                    'Révoque les anciens secrets côté cluster.',
                    'Réponse : nouvelle date d\'expiration (+6 mois).',
                ]}
            />
        </div>
    )
}
