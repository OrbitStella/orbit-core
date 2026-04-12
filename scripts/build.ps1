#!/usr/bin/env pwsh

# Build all packages in the monorepo
Write-Host "Building Orbit Core monorepo..." -ForegroundColor Green

# Build TypeScript packages
Write-Host "Building TypeScript packages..." -ForegroundColor Blue
pnpm -r --filter "./packages/*" build

# Build CLI package
Write-Host "Building CLI package..." -ForegroundColor Blue
pnpm --filter "@orbit-core/cli" build

# Build web app
Write-Host "Building web app..." -ForegroundColor Blue
pnpm --filter "@orbit-core/web" build

# Build contracts (requires Rust)
if (Get-Command cargo -ErrorAction SilentlyContinue) {
    Write-Host "Building contracts..." -ForegroundColor Blue
    pnpm --filter "@orbit-core/contracts" build
} else {
    Write-Host "Rust/Cargo not found, skipping contract builds" -ForegroundColor Yellow
}

Write-Host "Build complete!" -ForegroundColor Green
