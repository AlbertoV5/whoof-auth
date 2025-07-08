import { cache } from "react"
import { verifyUserToken } from "@whop/api"
import { headers } from "next/headers"
import type { Sdk } from "@whop/api"
import type {
  UserData,
  UserAppStatus,
  WhopExperienceAccessLevel,
  PreUserAuthResult,
} from "./credentials"

// Cache the token verification to avoid multiple calls per request
export const getCachedUserToken = cache(async () => {
  const headersList = await headers()
  return verifyUserToken(headersList)
})

// Cache the user access check to avoid multiple API calls
export const getCachedUserAccess = cache(
  async (sdk: Sdk, userId: string, experienceId: string) => {
    return sdk.access.checkIfUserHasAccessToExperience({
      userId,
      experienceId,
    })
  }
)

// Cache individual product access checks
export const getCachedProductAccess = cache(
  async (sdk: Sdk, userId: string, productId: string) => {
    try {
      const hasAccess = await sdk.access.checkIfUserHasAccessToProduct({
        userId,
        productId,
      })
      return hasAccess.hasAccess
    } catch (error) {
      // Failed to check access, return false
      return false
    }
  }
)

// Cache multiple product access checks
export const getCachedMultipleProductAccess = cache(
  async (sdk: Sdk, userId: string, productIds: string[]) => {
    const productAccess: Record<string, boolean> = {}
    
    // Use Promise.all to check all products in parallel for better performance
    const accessPromises = productIds.map(async (productId) => {
      const hasAccess = await getCachedProductAccess(sdk, userId, productId)
      return { productId, hasAccess }
    })
    
    const results = await Promise.all(accessPromises)
    
    for (const result of results) {
      productAccess[result.productId] = result.hasAccess
    }
    
    return productAccess
  }
)

// Cache the complete user authentication data with product access
export const getCachedUserAuthentication = cache(
  async (
    sdk: Sdk,
    experienceId: string,
    getUserStatus: (params: {
      userId: string
      accessLevel: WhopExperienceAccessLevel
    }) => UserAppStatus | null,
    preUserAuth?: (headersList: Headers) => Promise<PreUserAuthResult | null>,
    requiredProducts?: string[]
  ): Promise<UserData | null> => {
    const headersList = await headers()

    // Check pre-user authentication if configured
    if (preUserAuth) {
      const preAuthResult = await preUserAuth(headersList)
      if (preAuthResult) {
        return preAuthResult.userData
      }
    }

    // Get cached user token
    const user = await getCachedUserToken()
    if (!user) {
      return null
    }

    // Get cached user access
    const hasAccess = await getCachedUserAccess(sdk, user.userId, experienceId)

    const userStatus = getUserStatus({
      userId: user.userId,
      accessLevel: hasAccess.accessLevel,
    })

    if (!userStatus) {
      return null
    }

    // Get cached product access if required
    let productAccess: Record<string, boolean> = {}
    if (requiredProducts && requiredProducts.length > 0) {
      productAccess = await getCachedMultipleProductAccess(
        sdk,
        user.userId,
        requiredProducts
      )
    }

    return {
      userId: user.userId,
      userStatus,
      userAccessLevel: hasAccess.accessLevel,
      productAccess,
    }
  }
)

// Helper function to get user data with specific product access requirements
export const getCachedUserWithProductAccess = cache(
  async (
    sdk: Sdk,
    experienceId: string,
    getUserStatus: (params: {
      userId: string
      accessLevel: WhopExperienceAccessLevel
    }) => UserAppStatus | null,
    productIds: string[],
    preUserAuth?: (headersList: Headers) => Promise<PreUserAuthResult | null>
  ): Promise<UserData | null> => {
    return getCachedUserAuthentication(
      sdk,
      experienceId,
      getUserStatus,
      preUserAuth,
      productIds
    )
  }
)
