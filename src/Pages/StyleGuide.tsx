import { Alert } from '../Components/UI/Alerts'
import { Button } from '../Components/UI/Button'
import { Card } from '../Components/UI/Card'
import { Field } from '../Components/UI/Fields'

const COLORS: { name: string; token: string; hex: string; usage: string; dark?: boolean }[] = [
    { name: 'Texte principal', token: 'ink', hex: '#0F172A', usage: 'Titres, valeurs', dark: true },
    { name: 'Texte secondaire', token: 'ink-muted', hex: '#475569', usage: 'Aides, descriptions', dark: true },
    { name: 'Bordure', token: 'line', hex: '#CBD5E1', usage: 'Champs, cartes' },
    { name: 'Fond application', token: 'surface-sunken', hex: '#F1F5F9', usage: 'Arrière-plan' },
    { name: 'Action principale', token: 'brand-600', hex: '#1D4ED8', usage: 'Boutons, focus', dark: true },
    { name: 'Succès', token: 'success-700', hex: '#15803D', usage: 'Confirmations', dark: true },
    { name: 'Alerte', token: 'warning-700', hex: '#B45309', usage: 'Expiration proche', dark: true },
    { name: 'Erreur', token: 'danger-700', hex: '#B91C1C', usage: 'Erreurs, blocage', dark: true },
]

export function StyleGuide() {
    return (
        <div className="flex flex-col gap-6">
            <header>
                <p className="text-sm font-semibold text-brand-700">Référence</p>
                <h1 className="mt-1 text-3xl font-bold text-ink">Style guide minimal</h1>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
                    Jeu de composants réduit et volontairement sobre : contrastes AA minimum, cibles
                    cliquables de 48&nbsp;px, libellés explicites et messages d'erreur rédigés en langage
                    clair.
                </p>
            </header>

            <Card aria-labelledby="sg-couleurs">
                <h2 id="sg-couleurs" className="text-xl font-semibold text-ink">
                    Couleurs
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {COLORS.map((color) => (
                        <li key={color.token} className="overflow-hidden rounded-md border border-line">
                            <div
                                className="flex h-16 items-end p-2"
                                style={{ backgroundColor: color.hex }}
                                aria-hidden="true"
                            >
                                <span
                                    className={`font-mono text-xs ${color.dark ? 'text-white' : 'text-ink'}`}
                                >
                                    {color.hex}
                                </span>
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-semibold text-ink">{color.name}</p>
                                <p className="font-mono text-xs text-ink-subtle">{color.token}</p>
                                <p className="mt-1 text-sm text-ink-muted">{color.usage}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card aria-labelledby="sg-typo">
                <h2 id="sg-typo" className="text-xl font-semibold text-ink">
                    Typographie
                </h2>
                <dl className="mt-4 flex flex-col divide-y divide-line">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                        <dt className="text-3xl font-bold text-ink">Titre d'écran</dt>
                        <dd className="font-mono text-sm text-ink-muted">Inter Bold · 30 px</dd>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                        <dt className="text-xl font-semibold text-ink">Titre de section</dt>
                        <dd className="font-mono text-sm text-ink-muted">Inter SemiBold · 20 px</dd>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                        <dt className="text-[15px] text-ink">Texte courant et textes d'aide</dt>
                        <dd className="font-mono text-sm text-ink-muted">Inter Regular · 15 px</dd>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                        <dt className="font-mono text-[15px] text-ink">mdp-24-caracteres · 123456</dt>
                        <dd className="font-mono text-sm text-ink-muted">JetBrains Mono · secrets et codes</dd>
                    </div>
                </dl>
            </Card>

            <Card aria-labelledby="sg-boutons">
                <h2 id="sg-boutons" className="text-xl font-semibold text-ink">
                    Boutons et états
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button>Action principale</Button>
                    <Button variant="secondary">Action secondaire</Button>
                    <Button variant="ghost">Lien d'action</Button>
                    <Button variant="danger">Action destructrice</Button>
                    <Button loading>Chargement</Button>
                    <Button disabled>Désactivé</Button>
                </div>
                <p className="mt-3 text-sm text-ink-muted">
                    Hauteur minimale 48&nbsp;px, libellé explicite à l'infinitif, état de chargement annoncé
                    via <code className="font-mono">aria-busy</code>.
                </p>
            </Card>

            <Card aria-labelledby="sg-champs">
                <h2 id="sg-champs" className="text-xl font-semibold text-ink">
                    Champs de formulaire
                </h2>
                <div className="mt-4 grid gap-5 lg:grid-cols-3">
                    <Field
                        id="sg-default"
                        label="Champ standard"
                        hint="Texte d'aide affiché sous le label."
                        placeholder="Saisie"
                        defaultValue=""
                    />
                    <Field
                        id="sg-error"
                        label="Champ en erreur"
                        error="Saisissez un identifiant d'au moins 3 caractères."
                        defaultValue="ab"
                    />
                    <Field id="sg-disabled" label="Champ désactivé" disabled defaultValue="Indisponible" />
                </div>
            </Card>

            <Card aria-labelledby="sg-messages">
                <h2 id="sg-messages" className="text-xl font-semibold text-ink">
                    Messages système
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                    <Alert tone="info" title="Information">
                        Appel de la fonction serverless en cours.
                    </Alert>
                    <Alert tone="success" title="Succès">
                        Le secret a été généré et enregistré.
                    </Alert>
                    <Alert tone="warning" title="Avertissement">
                        Ce compte expirera dans moins de 15 jours.
                    </Alert>
                    <Alert tone="error" title="Erreur">
                        Identifiant ou mot de passe incorrect.
                    </Alert>
                </div>
            </Card>
        </div>
    )
}
