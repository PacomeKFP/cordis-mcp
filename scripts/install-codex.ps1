param([string]$Url='https://pacomekengafe--cordis-web.modal.run/mcp',[switch]$Login)
$ErrorActionPreference='Stop'
codex mcp add cordis --url $Url
if($LASTEXITCODE -ne 0){throw 'La configuration MCP a échoué.'}
if($Login){codex mcp login cordis --oauth-client-registration dcr;if($LASTEXITCODE -ne 0){throw 'Terminez la connexion dans le navigateur, puis relancez codex mcp login cordis.'}}
