import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, RefreshCwIcon, SmartphoneIcon } from 'lucide-react'
import { StepHeader } from '../Components/StepHeader'
import { ApiTracePanel } from '../Components/ApiTracePanel'
import { QrPanel } from '../Components/QrPanel'
import { Alert } from '../Components/UI/Alerts'
import { Button } from '../Components/UI/Button'
import { Card } from '../Components/UI/Card'
import { CopyField } from '../Components/UI/CopyField'
import { useDemo } from '../Contexts/DemoContext'
import { generateTotpSecret } from '../Utils/MockApi'
import type { RequestState, TotpSecret } from '../Types'

export function SetupTotp() {
    const navigate = useNavigate()
    const { username, setTotpConfigured, forceApiError } = useDemo()
    const [state, setState] = useState<RequestState>('idle')
    const [error, setError] = useState<string | undefined>()
    const [secret, setSecret] = useState<TotpSecret | null>(null)

    const handleGenerate = async () => {
        setError(undefined)
        setState('loading')
        try {
            const data = await generateTotpSecret(username, forceApiError)
            setSecret(data)
            setState('success')
            setTotpConfigured(true)
        } catch (err) {
            setState('error')
            setError(err instanceof Error ? err.message : 'Erreur inattendue.')
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div>
                <StepHeader
                    order="2"
                    title="Configuration de la double authentification"
                    description="La fonction serverless génère un secret TOTP unique associé au compte. Ce secret est partagé une seule fois, via un QR code, avec l'application d'authentification de l'utilisateur."
                />

                <Card aria-labelledby="titre-2fa">
                    <h2 id="titre-2fa" className="text-xl font-semibold text-ink">
                        Secret TOTP {username && <span className="font-normal text-ink-muted">· {username}</span>}
                    </h2>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-muted">
                        La 2FA ajoute un second facteur temporaire au mot de passe : même si le mot de passe
                        est compromis, la connexion reste impossible sans le code à 6 chiffres renouvelé
                        toutes les 30 secondes.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <Button
                            type="button"
                            onClick={handleGenerate}
                            loading={state === 'loading'}
                            icon={<SmartphoneIcon aria-hidden="true" className="h-5 w-5" />}
                        >
                            {state === 'success' ? 'Régénérer le secret 2FA' : 'Générer le secret 2FA'}
                        </Button>
                        {state === 'success' && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/connexion')}
                                icon={<ArrowRightIcon aria-hidden="true" className="h-5 w-5" />}
                            >
                                Tester la connexion
                            </Button>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-5">
                        {state === 'idle' && (
                            <Alert tone="info" title="Aucun secret généré pour l'instant">
                                Lancez la génération pour obtenir le QR code à scanner. L'ancien secret éventuel
                                serait immédiatement révoqué.
                            </Alert>
                        )}

                        {state === 'loading' && (
                            <Alert tone="info" title="Génération du secret en cours…">
                                Appel de <code className="font-mono">generate-totp-secret</code> sur le cluster
                                Kubernetes.
                            </Alert>
                        )}

                        {state === 'error' && (
                            <Alert
                                tone="error"
                                title="Le secret 2FA n'a pas pu être généré"
                                actions={
                                    <Button
                                        variant="secondary"
                                        onClick={handleGenerate}
                                        icon={<RefreshCwIcon aria-hidden="true" className="h-4 w-4" />}
                                    >
                                        Réessayer
                                    </Button>
                                }
                            >
                                {error} La configuration 2FA précédente reste active.
                            </Alert>
                        )}

                        {state === 'success' && secret && (
                            <>
                                <QrPanel
                                    value={secret.otpauthUri}
                                    badge="QR code TOTP"
                                    caption="Scannez ce QR code avec une application d'authentification (Google Authenticator, FreeOTP, Authy…). Elle affichera ensuite un code à 6 chiffres renouvelé toutes les 30 secondes."
                                />

                                <CopyField
                                    label="Clé de secours (saisie manuelle)"
                                    description="À utiliser uniquement si le scan du QR code est impossible."
                                    value={secret.secret}
                                />

                                <Alert tone="success" title="2FA activée pour ce compte">
                                    Le prochain écran de connexion demandera le code à 6 chiffres en plus du mot de
                                    passe.
                                </Alert>
                            </>
                        )}
                    </div>
                </Card>
            </div>

            <ApiTracePanel
                endpoint="POST /function/generate-totp-secret"
                state={state}
                notes={[
                    'Réponse : secret Base32 + URI otpauth://',
                    'Algorithme SHA1, 6 chiffres, période 30 s.',
                    'Le secret est stocké chiffré côté cluster.',
                ]}
            />
        </div>
    )
}
