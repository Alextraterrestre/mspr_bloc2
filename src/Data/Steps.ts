export interface FlowStep {
    path: string
    order: string
    label: string
    summary: string
}

export const flowSteps: FlowStep[] = [
    {
        path: '/creation-compte',
        order: '1',
        label: 'Création de compte',
        summary: 'Génération du mot de passe de 24 caractères',
    },
    {
        path: '/configuration-2fa',
        order: '2',
        label: 'Configuration 2FA',
        summary: 'Secret TOTP et QR code à scanner',
    },
    {
        path: '/connexion',
        order: '3',
        label: 'Connexion',
        summary: 'Username, mot de passe et code à 6 chiffres',
    },
    {
        path: '/renouvellement',
        order: '4',
        label: 'Renouvellement',
        summary: 'Rotation des identifiants après 6 mois',
    },
]
