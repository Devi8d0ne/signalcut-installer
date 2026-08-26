[CmdletBinding()]
param(
    [switch]$Check,
    [switch]$DownloadOnly
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$node = Get-Command node -ErrorAction SilentlyContinue

if (-not $node) {
    throw 'Node.js 20 or later is required. Install it from https://nodejs.org/ and run this command again.'
}

$arguments = @((Join-Path $repoRoot 'src\install.mjs'))
if ($Check) { $arguments += '--check' }
if ($DownloadOnly) { $arguments += '--download-only' }

& $node.Source @arguments
exit $LASTEXITCODE
