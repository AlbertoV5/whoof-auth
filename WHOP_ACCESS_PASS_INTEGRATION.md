# Whop Product Access Integration

## Overview

This document outlines the extended authentication system that supports Whop product access checks (formerly known as "access passes"). The solution provides a flexible factory pattern that allows you to cache user authentication data and perform granular product access validation.

## Key Features

- **Multi-Product Access Checking**: Check user access to multiple products in a single authentication flow
- **Flexible Access Requirements**: Support for "require all" or "require any" product access patterns
- **Comprehensive Caching**: Caches user tokens, experience access, and product access to minimize API calls
- **Backward Compatibility**: Maintains existing functionality while adding new product access features

## Architecture

### Extended Types

```typescript
// Extended UserData to include product access information
export type UserData = {
  userId: string
  userStatus: UserAppStatus
  userAccessLevel: WhopExperienceAccessLevel
  productAccess?: Record<string, boolean> // productId -> hasAccess
}

// Extended CredentialsOptions to support product access requirements
export type CredentialsOptions = {
  requiredUserStatus?: UserAppStatus
  requiredAccessLevel?: WhopExperienceAccessLevel
  requiredProducts?: string[] // Array of product IDs
  requireAllProducts?: boolean // Access validation strategy
}
```

### Factory Configuration

```typescript
export type AuthenticationConfig = {
  sdk: Sdk
  preUserAuth?: (headersList: Headers) => Promise<PreUserAuthResult | null>
  getUserStatus: (params: {
    userId: string
    accessLevel: WhopExperienceAccessLevel
  }) => UserAppStatus | null
  // New optional function for optimized product access checking
  checkProductAccess?: (params: {
    userId: string
    productIds: string[]
  }) => Promise<Record<string, boolean>>
}
```

## Usage Examples

### Basic Product Access Check

```typescript
const authenticateUser = createAuthenticationFunction({
  sdk: whopSdk,
  getUserStatus: ({ userId, accessLevel }) => {
    // Your user status logic
    return "user"
  }
})

const protectedHandler = authenticateUser(
  {
    requiredProducts: ["prod_123456789"], // Single product requirement
    requireAllProducts: true
  },
  async ({ userData, ...props }) => {
    // User has access to prod_123456789
    return { success: true, user: userData }
  }
)
```

### Multiple Product Access (Any Strategy)

```typescript
const protectedHandler = authenticateUser(
  {
    requiredProducts: ["prod_123456789", "prod_987654321"],
    requireAllProducts: false // User needs access to at least ONE product
  },
  async ({ userData, ...props }) => {
    // User has access to at least one of the specified products
    return { success: true, user: userData }
  }
)
```

### Multiple Product Access (All Strategy)

```typescript
const protectedHandler = authenticateUser(
  {
    requiredProducts: ["prod_premium", "prod_addon"],
    requireAllProducts: true // User must have access to ALL products
  },
  async ({ userData, ...props }) => {
    // User has access to both premium and addon products
    return { success: true, user: userData }
  }
)
```

### Advanced Usage with Custom Product Access Check

```typescript
const authenticateUser = createAuthenticationFunction({
  sdk: whopSdk,
  getUserStatus: ({ userId, accessLevel }) => {
    return "user"
  },
  // Custom product access check for optimized bulk operations
  checkProductAccess: async ({ userId, productIds }) => {
    // Your custom implementation - perhaps using a different API
    // or combining multiple checks for better performance
    const results: Record<string, boolean> = {}
    
    // Bulk check implementation
    const bulkResults = await yourBulkProductAccessAPI(userId, productIds)
    
    for (const productId of productIds) {
      results[productId] = bulkResults[productId] || false
    }
    
    return results
  }
})
```

## Caching Strategy

### Automatic Caching

The system automatically caches:
- User token verification
- Experience access checks
- Individual product access checks
- Bulk product access results

### Cache Functions

```typescript
// Individual product access (cached)
const hasAccess = await getCachedProductAccess(sdk, userId, productId)

// Multiple product access (cached)
const productAccess = await getCachedMultipleProductAccess(sdk, userId, productIds)

// Complete user authentication with product access
const userData = await getCachedUserAuthentication(
  sdk,
  experienceId,
  getUserStatus,
  preUserAuth,
  requiredProducts
)
```

## Error Handling

The system provides clear error messages for different failure scenarios:

- `"Unauthorized"` - No valid user token
- `"Insufficient product access"` - User lacks required product access
- Individual product access failures are handled gracefully (default to `false`)

## Performance Optimizations

### Parallel Product Checks

```typescript
// The system automatically checks multiple products in parallel
const accessPromises = productIds.map(async (productId) => {
  const hasAccess = await getCachedProductAccess(sdk, userId, productId)
  return { productId, hasAccess }
})

const results = await Promise.all(accessPromises)
```

### Request-Level Caching

All API calls are cached at the request level using React's `cache()` function, ensuring:
- No duplicate API calls within the same request
- Optimal performance for complex authorization flows
- Consistent data across multiple authorization checks

## Migration Guide

### From Access Passes to Products

If you're migrating from the deprecated "access passes" system:

1. **Update Product IDs**: Replace `pass_*` identifiers with `prod_*` identifiers
2. **Update API Calls**: Use `checkIfUserHasAccessToProduct` instead of access pass methods
3. **Update Configuration**: Use the new `requiredProducts` field instead of `requiredAccessPass`

### Backward Compatibility

The system maintains full backward compatibility:
- Existing `requiredUserStatus` and `requiredAccessLevel` continue to work
- New product access features are additive
- No breaking changes to existing authentication flows

## Best Practices

### 1. Granular Product Access

```typescript
// Good: Specific product requirements
{
  requiredProducts: ["prod_premium_features", "prod_api_access"],
  requireAllProducts: true
}

// Less optimal: Overly broad requirements
{
  requiredProducts: ["prod_basic", "prod_premium", "prod_enterprise"],
  requireAllProducts: false
}
```

### 2. Caching Strategy

```typescript
// Good: Let the system handle caching
const userData = await getCachedUserAuthentication(...)

// Avoid: Manual product access checks without caching
const access1 = await sdk.access.checkIfUserHasAccessToProduct({...})
const access2 = await sdk.access.checkIfUserHasAccessToProduct({...})
```

### 3. Error Handling

```typescript
// Good: Specific error handling
try {
  const result = await protectedHandler(props)
  return result
} catch (error) {
  if (error.message === "Insufficient product access") {
    // Handle product access specifically
    return { error: "Premium subscription required" }
  }
  // Handle other errors
  return { error: "Authentication failed" }
}
```

## Configuration Examples

### Simple E-commerce Setup

```typescript
const auth = createAuthenticationFunction({
  sdk: whopSdk,
  getUserStatus: ({ userId, accessLevel }) => {
    return accessLevel === "customer" ? "user" : "creator"
  }
})

// Premium feature
const premiumHandler = auth(
  { requiredProducts: ["prod_premium"] },
  async ({ userData }) => {
    // Premium feature implementation
  }
)
```

### Multi-Tier SaaS Setup

```typescript
const auth = createAuthenticationFunction({
  sdk: whopSdk,
  getUserStatus: ({ userId, accessLevel }) => {
    return accessLevel === "admin" ? "creator" : "user"
  }
})

// Requires basic subscription
const basicHandler = auth(
  { requiredProducts: ["prod_basic", "prod_premium", "prod_enterprise"] },
  async ({ userData }) => {
    // Available to any subscriber
  }
)

// Requires premium or enterprise
const premiumHandler = auth(
  { 
    requiredProducts: ["prod_premium", "prod_enterprise"],
    requireAllProducts: false
  },
  async ({ userData }) => {
    // Premium/Enterprise feature
  }
)

// Requires enterprise only
const enterpriseHandler = auth(
  { requiredProducts: ["prod_enterprise"] },
  async ({ userData }) => {
    // Enterprise-only feature
  }
)
```

## Conclusion

This extended authentication system provides a robust, performant, and flexible approach to handling product access validation in your Whop-integrated applications. The caching strategy ensures optimal performance while the factory pattern maintains clean, reusable code.

The system is designed to scale from simple single-product checks to complex multi-tier product access scenarios, all while maintaining backward compatibility and providing clear error handling.