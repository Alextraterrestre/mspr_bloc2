describe('Validation des champs et erreurs de connexion', () => {
    const PASSWORD = 'a1b2c3d4e5f6a1b2c3d4e5f6'

    it('refuse un identifiant de moins de 3 caractères', () => {
        cy.visit('/creation-compte')

        cy.get('#username').type('ab')
        cy.contains('button', 'Générer le mot de passe (24 caractères)').click()

        cy.contains("Saisissez un identifiant d'au moins 3 caractères.").should('be.visible')
    })

    it('rejette un mot de passe trop court à la connexion', () => {
        cy.visit('/connexion')

        cy.get('#login-username').type('m.dupont')
        cy.get('#login-password').type('trop-court')
        cy.get('#login-totp').type('123456')
        cy.contains('button', 'Se connecter').click()

        cy.contains('Identifiant ou mot de passe incorrect.').should('be.visible')
    })

    it('rejette un code TOTP invalide', () => {
        cy.visit('/connexion')

        cy.get('#login-username').type('m.dupont')
        cy.get('#login-password').type(PASSWORD)
        cy.get('#login-totp').type('000000')
        cy.contains('button', 'Se connecter').click()

        cy.contains('Code à 6 chiffres invalide ou expiré.').should('be.visible')
    })

    it('filtre les caractères non numériques du champ TOTP', () => {
        cy.visit('/connexion')

        cy.get('#login-totp').type('ab12cd3456')
        cy.get('#login-totp').should('have.value', '123456')
    })

    it("bloque la connexion d'un compte expiré puis renvoie au renouvellement", () => {
        cy.visit('/connexion')

        cy.get('#login-username').type('expire')
        cy.get('#login-password').type(PASSWORD)
        cy.get('#login-totp').type('123456')
        cy.contains('button', 'Se connecter').click()

        cy.contains('Compte expiré — connexion bloquée').should('be.visible')
        cy.contains('button', 'Renouveler mes identifiants').should('be.visible').click()
        cy.url().should('include', '/renouvellement')
    })
})