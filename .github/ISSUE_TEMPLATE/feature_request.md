---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: ['enhancement']
assignees: ''
---

## Feature Description
A clear and concise description of the feature you'd like to see implemented.

## Problem Statement
What problem does this feature solve? What pain point does it address?

## Proposed Solution
Please provide a detailed description of how you envision this feature working:

### User Story
As a [user type], I want [feature] so that [benefit].

### Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## Implementation Ideas

### SDK Changes
- [ ] New methods in OrbitClient
- [ ] Updated interfaces
- [ ] Additional utilities

### CLI Changes
- [ ] New commands
- [ ] Updated existing commands
- [ ] New flags/options

### Contract Changes
- [ ] New contract methods
- [ ] Updated storage
- [ ] New error codes

### Web App Changes
- [ ] New components
- [ ] Updated UI
- [ ] New pages

## API Design (if applicable)

### SDK API
```typescript
// Proposed API design
interface NewFeature {
  method: (params: any) => Promise<any>;
}
```

### CLI API
```bash
# Proposed CLI command
orbit new-feature --option value
```

### Contract API
```rust
// Proposed contract method
pub fn new_feature(env: Env, params: Params) -> Response {
    // Implementation
}
```

## Alternatives Considered
What other approaches or solutions have you considered? Why is your proposed solution better?

## Additional Context
Add any other context, mockups, or examples about the feature request here.

### Mockups
If you have UI mockups, please include them here.

### Examples
Provide examples of how this feature would be used in practice.

## Breaking Changes
Will this feature introduce any breaking changes?

- [ ] Yes, this will break existing functionality
- [ ] No, this is backwards compatible

If yes, please describe the breaking changes and migration path.

## Testing Strategy
How should this feature be tested?

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing
- [ ] Contract tests

## Documentation Requirements
What documentation needs to be updated?

- [ ] README.md
- [ ] API documentation
- [ ] CONTRIBUTING.md
- [ ] Quick start guide
- [ ] CLI help text

## Timeline
Is this feature time-sensitive?

- [ ] Yes, needed by [date]
- [ ] No, flexible timeline

## Checklist
- [ ] I have searched existing issues for similar requests
- [ ] I have considered whether this is a core feature or plugin
- [ ] I have thought about the impact on existing users
- [ ] I have provided sufficient detail for implementation

## Wave Contributors
If you're participating in the Stellar Wave program, please mention:
- Wave cohort: [e.g. Wave 4]
- Experience level: [beginner/intermediate/advanced]
- Interested in implementing: [yes/no/maybe]
