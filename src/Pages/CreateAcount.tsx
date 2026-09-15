import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, KeyRoundIcon, RefreshCwIcon } from 'lucide-react'
import { StepHeader } from '../components/StepHeader'
import { ApiTracePanel } from '../components/ApiTracePanel'
import { QrPanel } from '../components/QrPanel'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field } from '../components/ui/Field'
import { useDemo } from '../contexts/DemoContext'
import { generatePassword } from '../utils/mockApi'
import type { GeneratedPassword, RequestState } from '../types'

export function CreateAccount() {
    const navigate = useNavigate()
    const { username, setUsername, setPasswordIssued, setExpiresAt, forceApiError } = useDemo()
    const [state, setState] = useState<RequestState>('idle')
    const [fieldError, setFieldError] = useState<string | undefined>()
    const [apiError, setApiError] = useState<string | undefined>()
    const [result, setResult] = useState<GeneratedPassword | null>(null)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const value = username.trim()
        if (value.length < 3) {
            setFieldError("Saisissez un identifiant d'au moins 3 caractères.")
            return
        }
        setFieldError(undefined)
        setApiError(undefined)
        setState('loading')
        try {
            const data = await generatePassword(value, forceApiError)
            setResult(data)
            setState('success')
            setPasswordIssued(true)
            setExpiresAt(data.expiresAt)
        } catch (error) {
            setState('error')
            setApiError(error instanceof Error ? error.message : 'Erreur inattendue.')
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div>
                <StepHeader
                    order="1"
                    title="Création de compte"
                    description="L'identifiant est envoyé à la fonction serverless qui génère un mot de passe complexe de 24 caractères. Le mot de passe n'est jamais affiché en clair par défaut : il est transmis sous forme de QR code à usage unique."
                />

                <Card aria-labelledby="form-compte-titre">
                    <h2 id="form-compte-titre" className="text-xl font-semibold text-ink">
                        Identifiant du compte
                    </h2>

                    <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-5">
                        <Field
                            id="username"
                            name="username"
                            label="Nom d'utilisateur"
                            hint="3 à 32 caractères, sans espace. Il servira d'identifiant de connexion."
                            autoComplete="username"
                            required
                            value={username}
                            error={fieldError}
                            disabled={state === 'loading'}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="ex. m.dupont"
                        />

                        <div className="flex flex-wrap gap-3">
                            <Button
                                type="submit"
                                loading={state === 'loading'}
                                icon={<KeyRoundIcon aria-hidden="true" className="h-5 w-5" />}
                            >
                                {state === 'success'
                                    ? 'Régénérer le mot de passe'
                                    : 'Générer le mot de passe (24 caractères)'}
                            </Button>
                            {state === 'success' && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => navigate('/configuration-2fa')}
                                    icon={<ArrowRightIcon aria-hidden="true" className="h-5 w-5" />}
                                >
                                    Passer à la configuration 2FA
                                </Button>
                            )}
                        </div>
                    </form>

                    <div className="mt-6 flex flex-col gap-5">
                        {state === 'loading' && (
                            <Alert tone="info" title="Génération en cours…">
                                Appel de la fonction <code className="font-mono">generate-password</code> sur la
                                gateway OpenFaaS. Merci de patienter.
                            </Alert>
                        )}

                        {state === 'error' && (
                            <Alert
                                tone="error"
                                title="Le mot de passe n'a pas pu être généré"
                                actions={
                                    <Button
                                        variant="secondary"
                                        onClick={handleSubmit}
                                        icon={<RefreshCwIcon aria-hidden="true" className="h-4 w-4" />}
                                    >
                                        Réessayer
                                    </Button>
                                }
                            >
                                {apiError} Aucun compte n'a été créé : vous pouvez relancer l'opération sans
                                risque.
                            </Alert>
                        )}

                        {state === 'success' && result && (
                            <>
                                <Alert tone="success" title="Mot de passe généré et chiffré">
                                    Le compte <strong>{username}</strong> est créé. Le mot de passe reste côté
                                    backend&nbsp;; seul ce QR code permet de le récupérer.
                                </Alert>

                                <QrPanel
                                    value={result.payload}
                                    oneTime
                                    badge="QR code à usage unique"
                                    caption="Ce QR code contient le mot de passe de 24 caractères généré par le backend. Scannez-le avec votre gestionnaire de mots de passe : il ne sera plus affiché après avoir quitté cet écran."
                                />

                                <Alert tone="warning" title="Validité limitée à 6 mois">
                                    Ce mot de passe expirera le{' '}
                                    <strong>
                                        {new Date(result.expiresAt).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </strong>
                                    . Une rotation sera alors obligatoire pour se reconnecter.
                                </Alert>
                            </>
                        )}
                    </div>
                </Card>
            </div>

            <ApiTracePanel
                endpoint="POST /function/generate-password"
                state={state}
                notes={[
                    'Corps attendu : { "username": "…" }',
                    'Réponse : mot de passe de 24 caractères encodé dans le QR code.',
                    "Le front ne stocke rien : l'affichage est éphémère.",
                ]}
            />
        </div>
    )
}
