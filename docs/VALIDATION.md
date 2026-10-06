# Validation de Cordis MCP 0.3.0

Vérifications du 7 octobre 2026.

- Les deux tests du paquet passent : découverte des 16 outils via le SDK MCP officiel en stdio et refus des URLs de service non sûres.
- Le workflow GitHub passe sur Windows et Linux avec Node.js 22 : installation depuis le lockfile, tests et vérification du paquet npm.
- `npx --yes github:PacomeKFP/cordis-mcp --help` lance le paquet publié depuis GitHub sur Windows.
- La release `v0.3.0` fournit le paquet npm et l'archive du plugin, sans données ni secrets privés.
- Le plugin local `cordis@cordis-agents` est installé et activé dans Codex. La connexion au compte Cordis reste une étape individuelle ; installer le code ne donne aucun droit sur les notes.
- Le serveur Modal publié valide, avec un compte synthétique isolé : découverte OAuth, DCR, consentement navigateur, PKCE, 16 outils MCP, permissions en lecture seule, rotation du refresh token et révocation depuis l'interface Cordis.
- Le serveur principal dispose de tests pour les clients confidentiels, les audiences, les codes à usage unique, les refus de POST interorigine et les accès expirés.

L'installation ou l'activation du plugin dans chaque compte ChatGPT, et l'autorisation du compte Cordis par son propriétaire, ne sont pas automatisées par ces tests. Aucun compte personnel n'est utilisé dans les scénarios de production.
