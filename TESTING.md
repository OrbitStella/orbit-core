# Testing and Code Quality Guide

This guide covers the testing setup and code quality tools used in Orbit Core.

## Overview

Orbit Core uses a comprehensive testing and code quality setup:

- **Vitest** - Fast unit testing framework
- **ESLint** - Code linting and style checking
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters on staged files

## Testing

### Framework: Vitest

We use Vitest as our primary testing framework for TypeScript packages.

#### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

#### Test Structure

```
packages/
  sdk/
    __tests__/
      index.test.ts
    src/
      index.ts
  cli/
    __tests__/
      commands.test.ts
    src/
      commands/
  shared-utils/
    __tests__/
      index.test.ts
    src/
      index.ts
apps/
  web/
    __tests__/
      components.test.tsx
    src/
      components/
contracts/
  counter/
    src/
      lib.rs  # Rust tests are embedded
```

#### Writing Tests

##### Unit Tests (TypeScript)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { functionName } from '../src/index'

describe('functionName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should work correctly', () => {
    const result = functionName('input')
    expect(result).toBe('expected output')
  })

  it('should handle errors', () => {
    expect(() => functionName(null)).toThrow()
  })
})
```

##### Component Tests (React)

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { MyComponent } from '../src/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    render(<MyComponent />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

##### Contract Tests (Rust)

```rust
#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_contract_function() {
        let env = Env::default();
        let contract_id = env.register_contract(None, TestContract);
        let client = TestContractClient::new(&env, &contract_id);

        let result = client.test_method();
        assert_eq!(result, expected_value);
    }

    #[test]
    #[should_panic(expected = "error_code")]
    fn test_error_case() {
        let env = Env::default();
        let contract_id = env.register_contract(None, TestContract);
        let client = TestContractClient::new(&env, &contract_id);

        client.method_that_panics(); // Should panic with error code
    }
}
```

#### Mocking

##### Mocking Dependencies

```typescript
// Mock external modules
vi.mock('@orbit-core/sdk', () => ({
  createOrbitClient: vi.fn(),
  NETWORKS: {
    TESTNET: { /* ... */ }
  }
}))

// Mock file system
vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn()
}))

// Mock console methods
const originalConsole = global.console
beforeEach(() => {
  global.console = {
    ...originalConsole,
    log: vi.fn(),
    error: vi.fn()
  }
})
```

##### Mock Implementation

```typescript
const mockClient = {
  getAccount: vi.fn().mockResolvedValue({
    accountId: () => 'test-account',
    balances: []
  }),
  invokeContract: vi.fn().mockResolvedValue({
    result: 'success',
    transactionId: 'test-tx'
  })
}

vi.mocked(createOrbitClient).mockReturnValue(mockClient)
```

## Code Quality

### ESLint

We use ESLint with TypeScript support for code linting.

#### Configuration

ESLint is configured in `.eslintrc.js` with:

- TypeScript parser and plugin
- Prettier integration
- Recommended rules
- Custom rules for our codebase

#### Running ESLint

```bash
# Check for linting issues
pnpm lint

# Fix linting issues automatically
pnpm lint:fix
```

#### ESLint Rules

Key rules we enforce:

- No unused variables
- Explicit return types (warn)
- No explicit `any` (warn)
- Prefer nullish coalescing
- Prefer optional chaining
- No floating promises
- Proper await usage

#### Test Overrides

Test files have relaxed rules:

- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-non-null-assertion`: off
- `@typescript-eslint/explicit-function-return-type`: off

### Prettier

Prettier handles code formatting.

#### Configuration

Prettier is configured in `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### Running Prettier

```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

### Husky Pre-commit Hooks

Husky manages Git hooks for quality checks.

#### Setup

Husky is installed via `pnpm prepare` and configured in `.husky/`.

#### Pre-commit Hook

The pre-commit hook (`.husky/pre-commit`) runs:

1. **lint-staged** - Format and lint staged files
2. **TypeScript check** - Ensure no type errors
3. **Tests** - Run all tests

#### Hook Configuration

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "Running pre-commit hooks..."

# Run lint-staged
npx lint-staged

# Run type check
echo "Running TypeScript type check..."
pnpm typecheck

# Run tests
echo "Running tests..."
pnpm test

echo "Pre-commit hooks completed!"
```

### lint-staged

lint-staged runs linters on staged files only.

#### Configuration

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ],
    "*.rs": [
      "rustfmt"
    ]
  }
}
```

## Best Practices

### Testing

1. **Write descriptive test names** - Test names should clearly describe what's being tested
2. **Use beforeEach for setup** - Clean up test state between tests
3. **Mock external dependencies** - Don't rely on external services in tests
4. **Test edge cases** - Test error conditions and boundary cases
5. **Keep tests focused** - Each test should test one thing
6. **Use proper assertions** - Use specific matchers and assertions

### Code Quality

1. **Follow TypeScript best practices** - Use types effectively
2. **Write self-documenting code** - Use clear variable and function names
3. **Keep functions small** - Single responsibility principle
4. **Handle errors properly** - Use try-catch and proper error types
5. **Use consistent formatting** - Let Prettier handle formatting
6. **Write meaningful comments** - Explain complex logic, not obvious code

### Git Workflow

1. **Commit frequently** - Small, focused commits
2. **Write good commit messages** - Use conventional commit format
3. **Let hooks run** - Don't bypass pre-commit hooks
4. **Fix issues before pushing** - Ensure all checks pass
5. **Review your own PRs** - Self-review before requesting reviews

## Troubleshooting

### Common Issues

#### Test Failures

1. **Mock not working** - Ensure mocks are set up before imports
2. **Async test issues** - Use proper async/await or waitFor
3. **Module resolution** - Check vitest.config.ts path aliases

#### Linting Issues

1. **TypeScript errors** - Check tsconfig.json and path mappings
2. **ESLint rules** - Use `// eslint-disable-next-line` sparingly
3. **Formatting conflicts** - Run `pnpm format` to fix

#### Hook Issues

1. **Hooks not running** - Ensure Husky is installed (`pnpm prepare`)
2. **Permission issues** - Make hook files executable
3. **Path issues** - Use relative paths in hook scripts

### Getting Help

1. **Check the logs** - Look at test output and error messages
2. **Run commands locally** - Reproduce issues outside of hooks
3. **Check configuration** - Verify config files are correct
4. **Ask for help** - Use Discord or GitHub issues

## Coverage

### Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# View coverage in browser
open coverage/index.html
```

### Coverage Goals

- **SDK**: 90%+ coverage for core functionality
- **CLI**: 85%+ coverage for command handling
- **Utils**: 95%+ coverage for utility functions
- **Contracts**: 100% coverage for contract methods

### Coverage Exclusions

- Configuration files
- Type definitions
- Mock files
- Test files

## Continuous Integration

### GitHub Actions

The project uses GitHub Actions for CI/CD:

1. **Lint check** - Runs ESLint on all files
2. **Type check** - Runs TypeScript compiler
3. **Tests** - Runs all tests with coverage
4. **Build** - Ensures packages build correctly

### Local Development

Always run the full check suite before pushing:

```bash
# Run full check suite
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

This ensures your changes will pass CI and can be merged safely.
