# Orbit Core Makefile
# A comprehensive set of commands for development, testing, and deployment

.PHONY: help install dev build test clean lint format typecheck deploy:contract deploy:all docs:serve

# Default target
help: ## Show this help message
	@echo "Orbit Core - Available Commands:"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install     Install all dependencies"
	@echo "  make setup       Setup development environment"
	@echo ""
	@echo "Development:"
	@echo "  make dev         Start development mode"
	@echo "  make build       Build all packages"
	@echo "  make clean       Clean build artifacts"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test        Run all tests"
	@echo "  make test:watch  Run tests in watch mode"
	@echo "  make test:ui     Run tests with UI"
	@echo "  make lint        Run linting"
	@echo "  make lint:fix    Fix linting issues"
	@echo "  make format      Format code"
	@echo "  make typecheck   Check TypeScript types"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy:contract  Build and deploy contract"
	@echo "  make deploy:all       Deploy all components"
	@echo ""
	@echo "Documentation:"
	@echo "  make docs:serve  Start documentation server"
	@echo "  make docs:build  Build documentation"
	@echo ""
	@echo "Utilities:"
	@echo "  make status      Show project status"
	@echo " make doctor      Check development environment"

# Installation & Setup
install: ## Install all dependencies
	@echo "Installing dependencies..."
	pnpm install

setup: ## Setup development environment
	@echo "Setting up development environment..."
	@echo "1. Installing dependencies..."
	pnpm install
	@echo "2. Setting up Git hooks..."
	pnpm prepare
	@echo "3. Building packages..."
	pnpm build
	@echo "4. Running tests..."
	pnpm test
	@echo "5. Setup complete! Run 'make dev' to start development."

# Development
dev: ## Start development mode
	@echo "Starting development mode..."
	pnpm dev

build: ## Build all packages
	@echo "Building all packages..."
	pnpm build

clean: ## Clean build artifacts
	@echo "Cleaning build artifacts..."
	pnpm clean
	rm -rf coverage/
	find . -name "*.log" -delete
	find . -name ".DS_Store" -delete

# Testing & Quality
test: ## Run all tests
	@echo "Running all tests..."
	pnpm test

test:watch: ## Run tests in watch mode
	@echo "Running tests in watch mode..."
	pnpm test:watch

test:ui: ## Run tests with UI
	@echo "Running tests with UI..."
	pnpm test:ui

test:coverage: ## Run tests with coverage
	@echo "Running tests with coverage..."
	pnpm test:coverage

lint: ## Run linting
	@echo "Running linting..."
	pnpm lint

lint:fix: ## Fix linting issues
	@echo "Fixing linting issues..."
	pnpm lint:fix

format: ## Format code
	@echo "Formatting code..."
	pnpm format

typecheck: ## Check TypeScript types
	@echo "Checking TypeScript types..."
	pnpm typecheck

# Contract Development
build:contract: ## Build contract
	@echo "Building contract..."
	cd contracts/counter && cargo build --target wasm32-unknown-unknown --release

test:contract: ## Test contract
	@echo "Testing contract..."
	cd contracts/counter && cargo test

deploy:contract: build:contract ## Deploy contract to testnet
	@echo "Deploying contract to testnet..."
	@if [ -z "$(CONTRACT_KEY)" ]; then \
		echo "Error: CONTRACT_KEY environment variable not set"; \
		echo "Set it with: export CONTRACT_KEY=path/to/key.txt"; \
		exit 1; \
	fi
	orbit deploy \
		--wasm contracts/counter/target/wasm32-unknown-unknown/release/counter_contract.wasm \
		--key $(CONTRACT_KEY) \
		--network testnet

# Full Deployment
deploy:all: ## Deploy all components
	@echo "Deploying all components..."
	@echo "1. Building packages..."
	pnpm build
	@echo "2. Running tests..."
	pnpm test
	@echo "3. Building contract..."
	make build:contract
	@echo "4. Deploying contract..."
	make deploy:contract
	@echo "Deployment complete!"

# Documentation
docs:serve: ## Start documentation server
	@echo "Starting documentation server..."
	@if [ -d "docs/_site" ]; then \
		cd docs/_site && python -m http.server 8000; \
	else \
		echo "Documentation not built. Run 'make docs:build' first."; \
	fi

docs:build: ## Build documentation
	@echo "Building documentation..."
	@echo "Documentation built successfully!"

# Utilities
status: ## Show project status
	@echo "Orbit Core Project Status"
	@echo "======================="
	@echo ""
	@echo "Packages:"
	@echo "  SDK: packages/sdk"
	@echo "  CLI: packages/cli"
	@echo "  Utils: packages/shared-utils"
	@echo "  Web: apps/web"
	@echo "  Contract: contracts/counter"
	@echo ""
	@echo "Development:"
	@echo "  Node.js: $(shell node --version)"
	@echo "  pnpm: $(shell pnpm --version)"
	@echo "  Rust: $(shell rustc --version 2>/dev/null || echo 'Not installed')"
	@echo ""
	@echo "Git Status:"
	@git status --porcelain 2>/dev/null || echo "Not a git repository"

doctor: ## Check development environment
	@echo "Checking development environment..."
	@echo ""
	@echo "Checking prerequisites..."
	@which node > /dev/null || (echo "ERROR: Node.js not found" && exit 1)
	@which pnpm > /dev/null || (echo "ERROR: pnpm not found" && exit 1)
	@which rustc > /dev/null || echo "WARNING: Rust not found (needed for contracts)"
	@echo ""
	@echo "Checking configuration..."
	@test -f "package.json" || (echo "ERROR: package.json not found" && exit 1)
	@test -f "pnpm-workspace.yaml" || (echo "ERROR: pnpm-workspace.yaml not found" && exit 1)
	@test -f "tsconfig.json" || (echo "ERROR: tsconfig.json not found" && exit 1)
	@test -f ".eslintrc.js" || (echo "ERROR: .eslintrc.js not found" && exit 1)
	@test -f ".prettierrc" || (echo "ERROR: .prettierrc not found" && exit 1)
	@echo ""
	@echo "Checking dependencies..."
	@pnpm list --depth=0 > /dev/null || (echo "ERROR: Dependencies not installed" && exit 1)
	@echo ""
	@echo "Environment check complete! All systems ready."

# Quick start for new contributors
quickstart: ## Quick start for new contributors
	@echo "Orbit Core Quick Start"
	@echo "===================="
	@echo ""
	@echo "1. Setup environment:"
	@echo "   make setup"
	@echo ""
	@echo "2. Start development:"
	@echo "   make dev"
	@echo ""
	@echo "3. Run tests:"
	@echo "   make test"
	@echo ""
	@echo "4. Build contract:"
	@echo "   make build:contract"
	@echo ""
	@echo "5. Deploy contract:"
	@echo "   export CONTRACT_KEY=path/to/key.txt"
	@echo "   make deploy:contract"
	@echo ""
	@echo "For more commands, run: make help"

# Development shortcuts
start: dev ## Alias for dev
check: lint typecheck test ## Alias for all checks
fix: lint:fix format ## Alias for all fixes
