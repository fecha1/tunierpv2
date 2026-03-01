<# 
.SYNOPSIS
    TuniERP Dev Environment - One Command Startup
.DESCRIPTION
    Starts Docker (PostgreSQL + Redis) and all app services.
    Usage:  .\dev.ps1          (start everything)
            .\dev.ps1 stop     (stop everything)
#>

param([string]$Action = "start")

$ROOT = $PSScriptRoot
if (-not $ROOT) { $ROOT = (Get-Location).Path }
$ErrorActionPreference = "SilentlyContinue"

# ── STOP ──────────────────────────────────────────────────
if ($Action -eq "stop") {
    Write-Host "[STOP] Stopping TuniERP..." -ForegroundColor Red

    foreach ($port in @(4050, 4051, 4052, 4060)) {
        $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
                Where-Object State -eq 'Listen'
        if ($conn) {
            taskkill /F /PID $conn.OwningProcess 2>$null | Out-Null
            Write-Host "  Killed process on port $port" -ForegroundColor Yellow
        }
    }

    Set-Location $ROOT
    docker compose down 2>$null
    Write-Host "  Docker services stopped" -ForegroundColor Green
    Write-Host ""
    Write-Host "TuniERP stopped." -ForegroundColor Magenta
    exit 0
}

# ── START ─────────────────────────────────────────────────
Write-Host ""
Write-Host "  ========================================" -ForegroundColor Magenta
Write-Host "       TuniERP Dev Environment            " -ForegroundColor Magenta
Write-Host "  ========================================" -ForegroundColor Magenta
Write-Host ""

# 1. Kill orphan processes on our ports
Write-Host "[1/4] Cleaning up orphan processes..." -ForegroundColor Cyan
$killed = 0
foreach ($port in @(4050, 4051, 4052, 4060)) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
            Where-Object State -eq 'Listen'
    if ($conn) {
        taskkill /F /PID $conn.OwningProcess 2>$null | Out-Null
        $killed++
    }
}
if ($killed -gt 0) { Write-Host "  Killed $killed orphan process(es)" -ForegroundColor Yellow }
else { Write-Host "  Ports 4050, 4051, 4052, 4060 are free" -ForegroundColor Green }

# 2. Start Docker (PostgreSQL + Redis)
Write-Host "[2/4] Starting Docker (PostgreSQL + Redis)..." -ForegroundColor Cyan
Set-Location $ROOT
docker compose up postgres redis -d --remove-orphans 2>$null

Write-Host "  Waiting for PostgreSQL..." -ForegroundColor Yellow -NoNewline
$retries = 0
do {
    Start-Sleep -Seconds 1
    docker compose exec -T postgres pg_isready -U tunierp 2>$null | Out-Null
    $retries++
    Write-Host "." -NoNewline -ForegroundColor Yellow
} while ($LASTEXITCODE -ne 0 -and $retries -lt 30)
Write-Host ""

if ($retries -ge 30) {
    Write-Host "  ERROR: PostgreSQL failed to start!" -ForegroundColor Red
    exit 1
}
Write-Host "  PostgreSQL ready" -ForegroundColor Green

$redisPing = docker compose exec -T redis redis-cli ping 2>$null
if ($redisPing -match "PONG") { Write-Host "  Redis ready" -ForegroundColor Green }
else { Write-Host "  Redis may not be ready" -ForegroundColor Yellow }

# 3. Start app services in separate windows
Write-Host "[3/4] Starting application services..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Set-Location '$ROOT\apps\api'; `$Host.UI.RawUI.WindowTitle = 'TuniERP API :4060'; npx pnpm@9.15.0 run dev"
)
Write-Host "  API       -> http://localhost:4060" -ForegroundColor White

Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Set-Location '$ROOT\front'; `$Host.UI.RawUI.WindowTitle = 'TuniERP Front :4050'; npx pnpm@9.15.0 run dev"
)
Write-Host "  Frontend  -> http://localhost:4050" -ForegroundColor White

Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Set-Location '$ROOT\apps\dashboard'; `$Host.UI.RawUI.WindowTitle = 'TuniERP Dashboard :4052'; npx pnpm@9.15.0 run dev"
)
Write-Host "  Dashboard -> http://localhost:4052" -ForegroundColor White

Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Set-Location '$ROOT\admin\nextjs'; `$Host.UI.RawUI.WindowTitle = 'TuniERP Admin :4051'; npm run dev"
)
Write-Host "  Admin     -> http://localhost:4051" -ForegroundColor White

# 4. Wait for services to be ready
Write-Host "[4/4] Waiting for services to be ready..." -ForegroundColor Cyan
$services = @(
    @{ Name = "API";       Port = 4060 },
    @{ Name = "Frontend";  Port = 4050 },
    @{ Name = "Dashboard"; Port = 4052 },
    @{ Name = "Admin";     Port = 4051 }
)

foreach ($svc in $services) {
    $ready = $false
    for ($i = 0; $i -lt 90; $i++) {
        $conn = Get-NetTCPConnection -LocalPort $svc.Port -ErrorAction SilentlyContinue |
                Where-Object State -eq 'Listen'
        if ($conn) { $ready = $true; break }
        Start-Sleep -Seconds 1
    }
    if ($ready) { Write-Host "  $($svc.Name) ready on :$($svc.Port)" -ForegroundColor Green }
    else { Write-Host "  $($svc.Name) FAILED on :$($svc.Port)" -ForegroundColor Red }
}

# 5. Done
Write-Host ""
Write-Host "  ========================================" -ForegroundColor Green
Write-Host "       All Services Running!              " -ForegroundColor Green
Write-Host "  ========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:   http://localhost:4050" -ForegroundColor White
Write-Host "  Admin:      http://localhost:4051" -ForegroundColor White
Write-Host "  Dashboard:  http://localhost:4052" -ForegroundColor White
Write-Host "  API:        http://localhost:4060" -ForegroundColor White
Write-Host "  Swagger:    http://localhost:4060/api/docs" -ForegroundColor White
Write-Host "  PostgreSQL: localhost:5432" -ForegroundColor DarkGray
Write-Host "  Redis:      localhost:6379" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  To stop:  .\dev.ps1 stop" -ForegroundColor DarkGray
Write-Host ""
