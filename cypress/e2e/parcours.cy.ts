describe("Parcours complet d'identification (happy path)", () => {
    const USERNAME = 'm.dupont'
    const PASSWORD = 'a1b2c3d4e5f6a1b2c3d4e5f6'
    const TOTP_CODE = '123456'

    it('création de compte → configuration 2FA → connexion → renouvellement', () => {
        // --- Étape 1 : création de compte -------------------------------
        cy.visit('/creation-compte')

        cy.get('#username').type(USERNAME)
        cy.get('#username').should('have.value', USERNAME)

        cy.contains('button', 'Générer le mot de passe (24 caractères)').click()
        cy.contains('Mot de passe généré et chiffré').should('be.visible')

        // Le QR code est masqué (usage unique) tant qu'on ne l'a pas révélé.
        cy.contains('button', 'Afficher le QR code').should('be.visible').click()
        cy.contains('button', 'Afficher le QR code').should('not.exist')
        cy.contains('Validité limitée à 6 mois').should('be.visible')

        // --- Étape 2 : configuration 2FA -------------------------------
        cy.contains('button', 'Passer à la configuration 2FA').click()
        cy.url().should('include', '/configuration-2fa')

        cy.contains('button', 'Générer le secret 2FA').click()
        cy.contains('2FA activée pour ce compte').should('be.visible')
        cy.contains('Clé de secours (saisie manuelle)').should('be.visible')
        cy.contains('Scannez ce QR code avec une application').should('be.visible')
        cy.get('output').should('not.be.empty')

        // --- Étape 3 : connexion ----------------------------------------
        cy.contains('button', 'Tester la connexion').click()
        cy.url().should('include', '/connexion')

        cy.get('#login-username').should('have.value', USERNAME)
        cy.get('#login-password').type(PASSWORD)
        cy.get('#login-totp').type(TOTP_CODE)
        cy.contains('button', 'Se connecter').click()

        cy.contains('Connexion réussie').should('be.visible')

        // --- Étape 4 : renouvellement -----------------------------------
        cy.contains('button', "Voir l'écran de renouvellement").click()
        cy.url().should('include', '/renouvellement')

        // La finalisation est impossible tant que les deux secrets ne sont pas régénérés.
        cy.contains('button', 'Réactiver le compte').should('be.disabled')
        cy.contains('Action désactivée').should('be.visible')

        cy.contains('button', 'Régénérer le mot de passe').click()
        cy.contains('button', 'Régénérer à nouveau').should('be.visible')

        cy.contains('button', 'Régénérer le secret TOTP').click()
        cy.get('button:contains("Régénérer à nouveau")').should('have.length', 2)

        cy.contains('button', 'Réactiver le compte').should('be.enabled').click()
        cy.contains('Compte réactivé').should('be.visible')
        cy.contains('button', 'Retourner à la connexion').should('be.visible')
    })
})