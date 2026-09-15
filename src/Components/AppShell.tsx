import { NavLink, Outlet } from 'react-router-dom'
import { CheckIcon, ShieldCheckIcon } from 'lucide-react'
import { flowSteps } from '../Data/Steps'
import { useDemo } from '../Contexts/DemoContext'

export function AppShell() {
    const { username, passwordIssued, totpConfigured, accountState } = useDemo()

    const done: Record<string, boolean> = {
        '/creation-compte': passwordIssued,
        '/configuration-2fa': totpConfigured,
        '/connexion': false,
        '/renouvellement': false,
    }

    return (
        <div className="min-h-full w-full bg-surface-sunken font-sans">
            <a
                href="#contenu"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-600 focus:px-4 focus:py-3 focus:text-white"
            >
                Aller au contenu principal
            </a>

            <header className="border-b border-line bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
                    <div className="flex items-center gap-2.5">
                        <ShieldCheckIcon aria-hidden="true" className="h-6 w-6 text-brand-700" />
                        <div>
                            <p className="text-[15px] font-bold leading-tight text-ink">
                                PoC Authentification Serverless
                            </p>
                            <p className="text-sm text-ink-muted">OpenFaaS · Kubernetes · maquette de parcours</p>
                        </div>
                    </div>
                    <dl className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                            <dt className="text-ink-muted">Utilisateur&nbsp;:</dt>
                            <dd className="font-mono font-medium text-ink">{username || '—'}</dd>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <dt className="text-ink-muted">Compte&nbsp;:</dt>
                            <dd>
                                <span
                                    className={[
                                        'rounded-full border px-2.5 py-1 text-xs font-semibold',
                                        accountState === 'expired'
                                            ? 'border-danger-200 bg-danger-50 text-danger-800'
                                            : accountState === 'expiring'
                                                ? 'border-warning-200 bg-warning-50 text-warning-700'
                                                : 'border-success-200 bg-success-50 text-success-700',
                                    ].join(' ')}
                                >
                                    {accountState === 'expired'
                                        ? 'Expiré'
                                        : accountState === 'expiring'
                                            ? 'Expire bientôt'
                                            : 'Valide'}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </header>

            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 lg:flex-row lg:gap-10">
                <nav aria-label="Parcours de démonstration" className="lg:w-64 lg:shrink-0">
                    <ol className="flex flex-col gap-1.5">
                        {flowSteps.map((step) => (
                            <li key={step.path}>
                                <NavLink
                                    to={step.path}
                                    className={({ isActive }) =>
                                        [
                                            'flex min-h-[56px] items-start gap-3 rounded-md border px-3 py-2.5 transition-colors duration-150 ease-out',
                                            isActive
                                                ? 'border-brand-600 bg-white'
                                                : 'border-transparent hover:border-line hover:bg-white',
                                        ].join(' ')
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span
                                                aria-hidden="true"
                                                className={[
                                                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                                                    done[step.path]
                                                        ? 'border-success-700 bg-success-700 text-white'
                                                        : isActive
                                                            ? 'border-brand-600 bg-brand-600 text-white'
                                                            : 'border-line bg-white text-ink-muted',
                                                ].join(' ')}
                                            >
                                                {done[step.path] ? <CheckIcon className="h-3.5 w-3.5" /> : step.order}
                                            </span>
                                            <span className="flex flex-col">
                                                <span
                                                    className={`text-[15px] font-semibold ${isActive ? 'text-brand-800' : 'text-ink'}`}
                                                >
                                                    {step.label}
                                                </span>
                                                <span className="text-[13px] leading-snug text-ink-muted">
                                                    {step.summary}
                                                </span>
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                        <li className="mt-2 border-t border-line pt-2">
                            <NavLink
                                to="/style-guide"
                                className={({ isActive }) =>
                                    [
                                        'flex min-h-[48px] items-center rounded-md border px-3 text-[15px] font-semibold transition-colors duration-150 ease-out',
                                        isActive
                                            ? 'border-brand-600 bg-white text-brand-800'
                                            : 'border-transparent text-ink hover:border-line hover:bg-white',
                                    ].join(' ')
                                }
                            >
                                Style guide
                            </NavLink>
                        </li>
                    </ol>
                </nav>

                <main id="contenu" className="min-w-0 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
