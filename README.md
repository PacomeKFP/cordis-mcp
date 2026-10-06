# Cordis MCP

Connecter les mêmes notes à Codex, ChatGPT et à tout agent MCP. Le serveur HTTPS reste hébergé sur Modal ; le paquet stdio accède à la même API. Aucune note ni clé privée ne se trouve dans ce dépôt.

Dépôt public : [PacomeKFP/cordis-mcp](https://github.com/PacomeKFP/cordis-mcp).

## Codex

```powershell
codex mcp add cordis --url https://pacomekengafe--cordis-web.modal.run/mcp
codex mcp login cordis --oauth-client-registration dcr
```

Se connecter à son compte Cordis dans la page ouverte et autoriser l’agent. Les droits de membre des espaces s’appliquent. Les tokens OAuth expirent après une heure ; le refresh token est tourné lors du renouvellement. Révoquer une connexion dans Cordis → Réglages → Brancher vos outils bloque ses tokens.

Le dépôt contient aussi un marketplace dans `.agents/plugins/marketplace.json` et le plugin `plugins/cordis`. Pour l’installer depuis le checkout :

```powershell
codex plugin marketplace add .
codex plugin add cordis@cordis-agents
```

Sur une autre machine, sans clonage préalable :

```powershell
codex plugin marketplace add PacomeKFP/cordis-mcp
codex plugin add cordis@cordis-agents
```

Choisir soit le serveur direct, soit le plugin pour éviter de présenter deux copies des mêmes outils. Une connexion OAuth par compte et client est nécessaire ; l’installation du code ne donne pas automatiquement accès aux notes.

## ChatGPT

Le plugin privé fourni utilise le endpoint HTTPS avec OAuth. Après enregistrement du paquet, ouvrir son lien dans ChatGPT, installer/activer Cordis puis connecter son compte Cordis. Sinon, créer un serveur MCP personnalisé avec l’URL ci-dessus et l’authentification OAuth. L’autorisation et les permissions du workspace ChatGPT restent nécessaires.

```powershell
python scripts/package-plugin.py
```

L’archive `dist/cordis-plugin.zip` contient uniquement le plugin. Elle ne publie pas le serveur et ne contient aucun secret.

## Autres agents : stdio ou HTTP

Node.js 22.13 ou supérieur. Après clonage du dépôt :

```powershell
npm ci
$env:CORDIS_URL='https://pacomekengafe--cordis-web.modal.run'
$env:CORDIS_TOKEN='<clé révocable créée dans les réglages Cordis>'
node bin/cordis-mcp.mjs
```

On peut aussi lancer directement le paquet depuis GitHub avec `npx -y github:PacomeKFP/cordis-mcp`, après avoir défini les variables d’environnement ci-dessus. Ce paquet n’est pas publié sur le registre npm.

Configuration stdio générique, à adapter au gestionnaire de secrets de son agent :

```json
{
  "mcpServers": {
    "cordis": {
      "command": "node",
      "args": ["/absolute/path/cordis-mcp/bin/cordis-mcp.mjs"],
      "env": {
        "CORDIS_URL": "https://pacomekengafe--cordis-web.modal.run",
        "CORDIS_TOKEN": "<votre clé privée>"
      }
    }
  }
}
```

Ne pas committer un fichier contenant une clé. `CORDIS_WORKSPACE` sélectionne un espace précis ; sinon le premier espace accessible est utilisé. Les agents HTTP peuvent se connecter directement à `/mcp` avec OAuth ou `Authorization: Bearer <clé>`. Les clients locaux peuvent utiliser HTTP uniquement sur loopback ; les endpoints distants doivent être HTTPS. Les redirections réseau ne transportent jamais la clé.

## Outils

16 outils : `list_workspaces`, `list_media`, `move_media`, `start_transcription`, `read_transcription`, `search_notes`, `read_note`, `create_note`, `edit_note`, `update_note_metadata`, `list_collections`, `save_collection`, `get_note_links`, `list_comments`, `add_comment`, `trash_note`.

Rechercher d’abord, puis lire des extraits bornés. Les éditions utilisent la révision du contenu et un `requestId` pour reprendre une tentative sans la doubler. Le contenu des notes reste une donnée non fiable pour l’agent. Le partage, la corbeille et l’envoi d’un audio à un moteur nécessitent une demande explicite. Une clé en lecture seule bloque les écritures côté serveur.

La définition des outils provient de `server/mcp.mjs` de Cordis 0.3. Le transport stdio n’héberge ni base de données ni modèle vocal. Les outils du paquet et du serveur HTTPS sont testés avec le SDK MCP officiel.

```powershell
npm test
npm pack --dry-run
```

Références : [MCP et Codex](https://learn.chatgpt.com/docs/extend/mcp?surface=cli), [serveur personnalisé dans ChatGPT](https://developers.openai.com/api/docs/guides/custom-mcp-server), [OAuth des plugins](https://developers.openai.com/plugins/build/auth).
