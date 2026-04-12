# Orbit Core - Starter Issues for Stellar Wave Contributors

This document contains 15 starter issues designed for Stellar Wave contributors. Each issue is scoped to take 1-4 hours and covers different aspects of the Orbit Core project (SDK, CLI, contracts, and frontend).

## SDK Issues (Beginner)

### 1. [SDK] Add Contract Balance Query Method
**Labels:** `good first issue`, `wave`, `sdk`, `beginner`  
**Time:** 1-2 hours  
**Description:** Add a method to query the native balance of a contract account.

**Implementation:**
- Add `getContractBalance(contractId: string)` method to `OrbitClient`
- Use the existing `getAccount` method internally
- Return the XLM balance as a number
- Add error handling for invalid contract IDs

**Files to modify:** `packages/sdk/src/index.ts`

---

### 2. [SDK] Add Network Health Check
**Labels:** `good first issue`, `wave`, `sdk`, `beginner`  
**Time:** 1-2 hours  
**Description:** Add a method to check if the Stellar network is healthy and accessible.

**Implementation:**
- Add `isHealthy()` method to `OrbitClient`
- Make a simple request to the RPC server
- Return boolean indicating network status
- Add timeout handling

**Files to modify:** `packages/sdk/src/index.ts`

---

### 3. [SDK] Improve Error Messages
**Labels:** `good first issue`, `wave`, `sdk`, `beginner`  
**Time:** 2-3 hours  
**Description:** Improve error messages throughout the SDK to be more user-friendly and actionable.

**Implementation:**
- Review all error messages in the SDK
- Add specific error types for different scenarios
- Include suggestions for common issues
- Add error codes for programmatic handling

**Files to modify:** `packages/sdk/src/index.ts`

---

## CLI Issues (Beginner to Intermediate)

### 4. [CLI] Add Version Command
**Labels:** `good first issue`, `wave`, `cli`, `beginner`  
**Time:** 1 hour  
**Description:** Add a `version` command to the CLI tool that displays the current version.

**Implementation:**
- Add `orbit version` command
- Read version from package.json
- Display in a user-friendly format
- Add to help menu

**Files to modify:** `packages/cli/src/cli.ts`

---

### 5. [CLI] Add Network Status Command
**Labels:** `good first issue`, `wave`, `cli`, `beginner`  
**Time:** 1-2 hours  
**Description:** Add a command to check the status of Stellar networks.

**Implementation:**
- Add `orbit status` command
- Use SDK health check method
- Display network information (height, version, etc.)
- Support all networks (testnet, futurenet, mainnet)

**Files to modify:** `packages/cli/src/commands/`

---

### 6. [CLI] Improve Input Validation
**Labels:** `good first issue`, `wave`, `cli`, `intermediate`  
**Time:** 2-3 hours  
**Description:** Add better input validation and error messages to CLI commands.

**Implementation:**
- Add validation for public keys
- Add validation for contract IDs
- Add validation for file paths
- Improve error messages with suggestions

**Files to modify:** `packages/cli/src/commands/deploy.ts`, `packages/cli/src/commands/invoke.ts`

---

### 7. [CLI] Add Config File Support
**Labels:** `good first issue`, `wave`, `cli`, `intermediate`  
**Time:** 3-4 hours  
**Description:** Add support for a configuration file to store default settings.

**Implementation:**
- Add `orbit config` commands
- Support storing default network, key file, etc.
- Create `~/.orbit/config.json` file
- Update commands to read from config

**Files to modify:** `packages/cli/src/commands/`, new config files

---

## Contract Issues (Beginner to Intermediate)

### 8. [Contract] Add Events to Counter Contract
**Labels:** `good first issue`, `wave`, `contracts`, `beginner`  
**Time:** 1-2 hours  
**Description:** Add events to the counter contract for better tracking.

**Implementation:**
- Add events for increment, reset, and initialization
- Use Soroban event system
- Update tests to check for events
- Document the events

**Files to modify:** `contracts/counter/src/lib.rs`

---

### 9. [Contract] Add Decrement Method
**Labels:** `good first issue`, `wave`, `contracts`, `beginner`  
**Time:** 1-2 hours  
**Description:** Add a decrement method to the counter contract with underflow protection.

**Implementation:**
- Add `decrement()` method
- Prevent going below zero
- Add error for underflow attempt
- Add tests for the new method

**Files to modify:** `contracts/counter/src/lib.rs`

---

### 10. [Contract] Add Contract Metadata
**Labels:** `good first issue`, `wave`, `contracts`, `intermediate`  
**Time:** 2-3 hours  
**Description:** Add metadata storage to the counter contract.

**Implementation:**
- Add storage for contract name and version
- Add getter methods for metadata
- Initialize metadata in constructor
- Add tests for metadata

**Files to modify:** `contracts/counter/src/lib.rs`

---

### 11. [Contract] Improve Error Messages
**Labels:** `good first issue`, `wave`, `contracts`, `intermediate`  
**Time:** 2-3 hours  
**Description:** Improve error messages in the counter contract with more descriptive errors.

**Implementation:**
- Add custom error types
- Improve panic messages
- Add error documentation
- Update tests to check specific errors

**Files to modify:** `contracts/counter/src/lib.rs`

---

## Frontend Issues (Beginner to Intermediate)

### 12. [Frontend] Add Loading States
**Labels:** `good first issue`, `wave`, `frontend`, `beginner`  
**Time:** 1-2 hours  
**Description:** Add proper loading states and spinners to the web application.

**Implementation:**
- Add loading indicators for async operations
- Use skeleton screens for better UX
- Add progress bars for long operations
- Ensure consistent loading experience

**Files to modify:** `apps/web/src/components/`

---

### 13. [Frontend] Add Error Boundaries
**Labels:** `good first issue`, `wave`, `frontend`, `intermediate`  
**Time:** 2-3 hours  
**Description:** Add React error boundaries to handle and display errors gracefully.

**Implementation:**
- Create ErrorBoundary component
- Wrap components that might fail
- Add error reporting and logging
- Add user-friendly error messages

**Files to modify:** `apps/web/src/components/`, `apps/web/src/app/`

---

### 14. [Frontend] Add Transaction History
**Labels:** `good first issue`, `wave`, `frontend`, `intermediate`  
**Time:** 3-4 hours  
**Description:** Add a transaction history component to display recent contract interactions.

**Implementation:**
- Create TransactionHistory component
- Store transactions in localStorage
- Display transaction status and details
- Add ability to clear history

**Files to modify:** `apps/web/src/components/`, `apps/web/src/app/`

---

### 15. [Frontend] Add Dark Mode Toggle
**Labels:** `good first issue`, `wave`, `frontend`, `intermediate`  
**Time:** 2-3 hours  
**Description:** Add a dark mode toggle to the web application.

**Implementation:**
- Add dark mode CSS classes with Tailwind
- Create theme toggle component
- Store preference in localStorage
- Ensure all components support dark mode

**Files to modify:** `apps/web/src/components/`, `apps/web/src/app/globals.css`

---

## How to Claim an Issue

1. **Check if issue is available:** Look for issues without assignees
2. **Comment on the issue:** Express your interest in working on it
3. **Wait for assignment:** A maintainer will assign the issue to you
4. **Create a branch:** `git checkout -b fix/issue-number-description`
5. **Implement the solution:** Follow the instructions in the issue
6. **Test your changes:** Ensure everything works correctly
7. **Submit a pull request:** Include tests and documentation updates

## Getting Help

### Discord Support
- **#wave-help:** General questions and guidance
- **#wave-office-hours:** Live help during office hours
- **#orbit-core:** Project-specific discussions

### Office Hours
- **Schedule:** Tuesday and Thursday, 2-4 PM UTC
- **Link:** [Meeting link]
- **Mentors:** Available for 1-on-1 sessions

### Resources
- [Contributing Guide](../CONTRIBUTING.md)
- [Quick Start Guide](../QUICK_START.md)
- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)

## Tips for Success

### For Beginners
1. **Start with SDK or CLI issues** - They have clearer requirements
2. **Read the documentation** - Understanding the context helps
3. **Ask questions early** - Don't get stuck for too long
4. **Test frequently** - Catch issues early

### For Intermediate Contributors
1. **Look at similar implementations** - Learn from existing code
2. **Consider edge cases** - Think about error conditions
3. **Write comprehensive tests** - Ensure robust solutions
4. **Update documentation** - Help future contributors

### General Tips
1. **Communicate progress** - Let others know what you're working on
2. **Review other PRs** - Learn from peer reviews
3. **Be patient** - Code review takes time
4. **Celebrate small wins** - Every contribution matters!

## Recognition

All completed contributions will be:

- Listed in our contributor acknowledgments
- Counted toward Wave completion requirements
- Eligible for Wave badges and certificates
- Showcased in our project highlights

## Next Steps After Completion

After completing your first issue:

1. **Try another issue** - Build on your experience
2. **Explore different areas** - Try SDK, CLI, contracts, or frontend
3. **Help review others** - Learn by reviewing PRs
4. **Mentor new contributors** - Share your knowledge

---

**Welcome to Stellar Wave! We're excited to have you contribute to Orbit Core. :rocket:**
