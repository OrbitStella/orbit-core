---
name: Stellar Wave Task
about: A task specifically designed for Stellar Wave contributors
title: '[WAVE] '
labels: ['wave', 'good first issue']
assignees: ''
---

## Wave Task Overview
This issue is part of the Stellar Wave program and is designed to help contributors get started with the Orbit Core project.

## Task Description
A clear description of what needs to be accomplished.

## Learning Objectives
What will contributors learn by completing this task?

- [ ] Understanding Stellar/Soroban concepts
- [ ] TypeScript/JavaScript development
- [ ] Rust contract development
- [ ] CLI tool development
- [ ] React/Next.js development
- [ ] Monorepo management

## Difficulty Level
- [ ] Beginner (1-2 hours)
- [ ] Intermediate (2-4 hours)
- [ ] Advanced (4+ hours)

## Prerequisites
What should contributors know before starting?

### Required Knowledge
- [ ] Basic JavaScript/TypeScript
- [ ] Git and GitHub
- [ ] Command line usage

### Helpful but not Required
- [ ] Stellar/Soroban experience
- [ ] Rust programming
- [ ] React/Next.js experience

## Step-by-Step Instructions

### 1. Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/orbit-core.git
cd orbit-core

# Install dependencies
pnpm install
cp .env.example .env
```

### 2. Implementation Steps
Provide detailed steps for completing the task:

1. **Step 1**: [Description]
   ```bash
   # Commands to run
   ```

2. **Step 2**: [Description]
   ```typescript
   // Code to write
   ```

3. **Step 3**: [Description]
   ```rust
   // Contract code
   ```

### 3. Testing
```bash
# How to test the implementation
pnpm test
```

### 4. Verification
How to verify the task is complete:
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated

## Files to Modify
List the specific files that need to be changed:

- `packages/sdk/src/index.ts` - [Description of changes]
- `packages/cli/src/commands/deploy.ts` - [Description of changes]
- `contracts/counter/src/lib.rs` - [Description of changes]
- `apps/web/src/components/ContractInteraction.tsx` - [Description of changes]

## Code Templates

### SDK Method Template
```typescript
/**
 * [Description of method]
 * @param params - [Description]
 * @returns [Description]
 */
async newMethod(params: any): Promise<any> {
  try {
    // Implementation here
  } catch (error) {
    throw new Error(`Failed to newMethod: ${error.message}`);
  }
}
```

### CLI Command Template
```typescript
export const newCommand = new Command('new-command')
  .description('Description of command')
  .option('--option <value>', 'Description of option')
  .action(async (options) => {
    try {
      // Implementation here
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });
```

### Contract Method Template
```rust
/// Description of contract method
pub fn new_method(env: Env, param: Type) -> ReturnType {
    // Implementation here
}
```

## Resources
Provide helpful resources for completing this task:

### Documentation
- [Stellar Developers](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Orbit Core README](./README.md)
- [Contributing Guide](./CONTRIBUTING.md)

### Code Examples
- Link to similar implementations
- Reference files in the codebase
- External examples

## Getting Help

### Office Hours
- Schedule: [Time and date]
- Link: [Meeting link]

### Discord
- Channel: #wave-help
- Mentors: @mentor1, @mentor2

### Office Hours Support
- Live coding sessions
- Code review assistance
- Debugging help

## Success Criteria
How do we know this task is complete?

### Functional Requirements
- [ ] Feature works as described
- [ ] Tests pass
- [ ] No regressions

### Code Quality
- [ ] Code follows project style
- [ ] Proper error handling
- [ ] Documentation updated

### Learning Outcomes
- [ ] Contributor understands the concept
- [ ] Can explain their implementation
- [ ] Ready for next challenge

## Next Steps
After completing this task, contributors can:

- [ ] Try another beginner task
- [ ] Move to intermediate tasks
- [ ] Explore a different area (SDK, CLI, contracts, frontend)
- [ ] Help review other contributions

## Recognition
Completed tasks will be:

- [ ] Listed in contributor acknowledgments
- [ ] Counted toward Wave completion requirements
- [ ] Eligible for Wave badges and certificates

## Mentor Notes
(For mentors only - internal guidance)

### Common Pitfalls
- [ ] Common mistake 1
- [ ] Common mistake 2

### Tips for Success
- [ ] Tip 1
- [ ] Tip 2

### Extension Opportunities
- [ ] Additional feature idea
- [ ] Performance improvement
- [ ] Enhanced error handling

## Checklist for Contributors
- [ ] I have read the instructions carefully
- [ ] I have set up my development environment
- [ ] I understand the learning objectives
- [ ] I know where to get help if needed
- [ ] I'm ready to start coding! :rocket:

---

**Good luck, Wave contributor! We're excited to see what you build!**
