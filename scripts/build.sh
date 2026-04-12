#!/bin/bash

# Build all packages in the monorepo
echo "Building Orbit Core monorepo..."

# Build TypeScript packages
echo "Building TypeScript packages..."
pnpm -r --filter "./packages/*" build

# Build CLI package
echo "Building CLI package..."
pnpm --filter "@orbit-core/cli" build

# Build web app
echo "Building web app..."
pnpm --filter "@orbit-core/web" build

# Build contracts (requires Rust)
if command -v cargo &> /dev/null; then
    echo "Building contracts..."
    pnpm --filter "@orbit-core/contracts" build
else
    echo "Rust/Cargo not found, skipping contract builds"
fi

echo "Build complete!"
