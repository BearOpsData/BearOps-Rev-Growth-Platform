# Regression Testing Guide

## Overview

Regression tests ensure that existing functionality doesn't break when new code is merged. These tests are critical for maintaining code quality and preventing bugs from reaching production.

## Test Categories

### 1. Critical Path Tests
**Location:** `__tests__/regression/critical-paths.test.tsx`

Tests the most important user journeys that must never break:
- Home page rendering
- Tab navigation
- Component rendering
- User interactions
- Data integrity
- Accessibility

**Run:** `npm run test:regression`

### 2. Snapshot Tests
**Location:** `__tests__/regression/snapshot.test.tsx`

Captures component output and detects unintended UI changes:
- Component structure
- CSS classes
- HTML structure

**Run:** `npm run test:snapshot`

**Update snapshots:** `npm run test:snapshot -u`

### 3. Backward Compatibility Tests
**Location:** `__tests__/regression/backward-compatibility.test.tsx`

Ensures API and behavior compatibility:
- Component props
- CSS classes
- Data structures
- Behavior patterns

**Run:** `npm run test:regression`

### 4. Merge Validation Tests
**Location:** `__tests__/regression/merge-validation.test.tsx`

Critical tests that run before code is merged:
- Complete user journey
- Error-free rendering
- Accessibility compliance
- Performance benchmarks
- Data integrity

**Run:** `npm run test:merge-validation`

## Running Regression Tests

### All Regression Tests
```bash
npm run test:regression
```

### Snapshot Tests Only
```bash
npm run test:snapshot
```

### Merge Validation (Before PR)
```bash
npm run test:merge-validation
```

### All Tests (Including Regression)
```bash
npm run test:all
```

### CI/CD (Full Suite)
```bash
npm run test:ci
```

## When to Run Regression Tests

### Before Merging Code
✅ Always run `npm run test:merge-validation` before creating a PR

### After Major Changes
✅ Run `npm run test:regression` after:
- Refactoring components
- Changing component APIs
- Updating dependencies
- Modifying routing

### Before Releases
✅ Run `npm run test:all` before:
- Deploying to staging
- Deploying to production
- Creating release tags

## Snapshot Testing

### What Are Snapshots?
Snapshots capture the rendered output of components. If the output changes, the test fails, alerting you to unintended changes.

### Updating Snapshots
When you intentionally change a component:

```bash
# Update all snapshots
npm run test:snapshot -u

# Update specific snapshot
npm test snapshot.test.tsx -u
```

### Reviewing Snapshot Changes
Always review snapshot diffs carefully:
1. Check if changes are intentional
2. Verify UI still looks correct
3. Ensure accessibility is maintained

## CI/CD Integration

Regression tests run automatically on:
- **Pull Requests** - All regression tests
- **Pushes to main/dev/stage** - Full test suite
- **Merge validation** - Critical path tests

See `.github/workflows/regression-tests.yml`

## Best Practices

### 1. Keep Tests Focused
- Test one thing per test
- Use descriptive test names
- Group related tests in describe blocks

### 2. Test Critical Paths First
- Focus on user-facing features
- Test the happy path
- Test error scenarios

### 3. Maintain Snapshots
- Review snapshot changes carefully
- Update snapshots when UI changes are intentional
- Don't blindly accept all snapshot changes

### 4. Run Before Merging
- Always run regression tests before PR
- Fix failing tests before merging
- Don't skip tests to merge faster

### 5. Document Changes
- If a test needs to be updated, document why
- Explain breaking changes in PR description
- Update test documentation when needed

## Troubleshooting

### Snapshot Tests Failing
```bash
# Review the diff
npm run test:snapshot

# If changes are intentional, update
npm run test:snapshot -u
```

### Regression Tests Failing
1. Identify which test is failing
2. Check what changed in your code
3. Determine if it's a real regression or expected change
4. Fix the issue or update the test

### Performance Tests Failing
- Check if performance actually degraded
- Review recent changes that might affect performance
- Consider optimizing the code

## Test Coverage Goals

- **Critical Paths**: 100% coverage
- **User Journeys**: 100% coverage
- **Component APIs**: 90%+ coverage
- **Edge Cases**: 80%+ coverage

## Adding New Regression Tests

When adding new features:

1. **Add to Critical Paths** if it's a core feature
2. **Add to Merge Validation** if it's user-facing
3. **Update Snapshots** if UI changes
4. **Add to Backward Compatibility** if API changes

Example:
```typescript
it('CRITICAL: New feature should work correctly', () => {
  // Test the new feature
  // Ensure it doesn't break existing functionality
})
```

## Monitoring

Regression tests help catch:
- ✅ Breaking changes before merge
- ✅ Unintended UI changes
- ✅ Performance regressions
- ✅ Accessibility issues
- ✅ API compatibility problems

## Summary

Regression tests are your safety net. They ensure that:
- Existing features continue to work
- UI changes are intentional
- Performance doesn't degrade
- Accessibility is maintained
- APIs remain compatible

**Always run regression tests before merging code!**

