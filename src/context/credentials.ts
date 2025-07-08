import { verifyUserToken } from "@whop/api"
import type { Sdk } from "@whop/api"
import { getExperienceId } from "./experience"
import { headers } from "next/headers"

/** Developer are "super-admin" users */
export type UserAppStatus = "creator" | "user" | "developer"
export type WhopExperienceAccessLevel = "admin" | "customer" | "no_access"

// Extended UserData to include product access information
export type UserData = {
  userId: string
  userStatus: UserAppStatus
  userAccessLevel: WhopExperienceAccessLevel
  productAccess?: Record<string, boolean> // productId -> hasAccess
}

export type AuthenticatedProps<InputProps extends Record<string, any>> =
  InputProps & {
    userData: UserData
    experienceId: string
    cronSecret?: string
    skipUserFetching?: boolean
  }

// Extended CredentialsOptions to support product access requirements
export type CredentialsOptions = {
  requiredUserStatus?: UserAppStatus
  requiredAccessLevel?: WhopExperienceAccessLevel
  requiredProducts?: string[] // Array of product IDs that user must have access to
  requireAllProducts?: boolean // If true, user must have access to ALL products; if false, user needs access to at least ONE
}

// Configuration types for the factory
export type PreUserAuthResult = {
  userData: UserData
  cronSecret?: string
}

export type AuthenticationConfig = {
  sdk: Sdk
  preUserAuth?: (headersList: Headers) => Promise<PreUserAuthResult | null>
  getUserStatus: (params: {
    userId: string
    accessLevel: WhopExperienceAccessLevel
  }) => UserAppStatus | null
  // New function to check product access
  checkProductAccess?: (params: {
    userId: string
    productIds: string[]
  }) => Promise<Record<string, boolean>>
}

// Factory function to create Authenticated function with custom configuration
export function createAuthenticationFunction(config: AuthenticationConfig) {
  return function <Inputs extends Record<string, any>, Output>(
    options: CredentialsOptions,
    wrapped: (inputProps: AuthenticatedProps<Inputs>) => Promise<Output>
  ): (props?: Inputs & { experienceId?: string }) => Promise<Output> {
    return async (rawProps?: Inputs) => {
      const props = rawProps || ({} as Inputs)
      // Attempt to get experienceId from props, otherwise get it from the context
      let experienceId = props.experienceId
      if (!experienceId) {
        experienceId = getExperienceId()
      }
      const headersList = await headers()
      // Check pre-user authentication if configured
      if (config.preUserAuth) {
        const preAuthResult = await config.preUserAuth(headersList)
        if (preAuthResult) {
          // If pre-auth has product access requirements, validate them
          if (options.requiredProducts && options.requiredProducts.length > 0) {
            const hasRequiredAccess = validateProductAccess(
              preAuthResult.userData.productAccess || {},
              options.requiredProducts,
              options.requireAllProducts
            )
            if (!hasRequiredAccess) {
              throw new Error("Insufficient product access")
            }
          }
          return wrapped({
            ...props,
            ...preAuthResult,
            experienceId,
          })
        }
      }
      // Handle user authentication
      const user = await verifyUserToken(headersList)
      if (!user) {
        throw new Error("Unauthorized")
      }
      // Get user access to the experience
      const hasAccess =
        await config.sdk.access.checkIfUserHasAccessToExperience({
          userId: user.userId,
          experienceId,
        })

      const userStatus = config.getUserStatus({
        userId: user.userId,
        accessLevel: hasAccess.accessLevel,
      })

      if (!userStatus) {
        throw new Error("Unauthorized")
      }

      if (
        options?.requiredUserStatus &&
        userStatus !== options.requiredUserStatus
      ) {
        throw new Error("Unauthorized")
      }

      // Check product access if required
      let productAccess: Record<string, boolean> = {}
      if (options.requiredProducts && options.requiredProducts.length > 0) {
        if (config.checkProductAccess) {
          productAccess = await config.checkProductAccess({
            userId: user.userId,
            productIds: options.requiredProducts,
          })
        } else {
          // Fallback: check each product individually using the SDK
          productAccess = await checkProductAccessFallback(
            config.sdk,
            user.userId,
            options.requiredProducts
          )
        }

        const hasRequiredAccess = validateProductAccess(
          productAccess,
          options.requiredProducts,
          options.requireAllProducts
        )

        if (!hasRequiredAccess) {
          throw new Error("Insufficient product access")
        }
      }

      return wrapped({
        ...props,
        userData: {
          userId: user.userId,
          userStatus,
          userAccessLevel: hasAccess.accessLevel,
          productAccess,
        },
        experienceId,
      })
    }
  }
}

// Helper function to validate product access requirements
function validateProductAccess(
  userProductAccess: Record<string, boolean>,
  requiredProducts: string[],
  requireAllProducts?: boolean
): boolean {
  if (requireAllProducts) {
    // User must have access to ALL required products
    return requiredProducts.every((productId) => userProductAccess[productId])
  } else {
    // User must have access to at least ONE required product
    return requiredProducts.some((productId) => userProductAccess[productId])
  }
}

// Fallback function to check product access when checkProductAccess is not provided
async function checkProductAccessFallback(
  sdk: Sdk,
  userId: string,
  productIds: string[]
): Promise<Record<string, boolean>> {
  const productAccess: Record<string, boolean> = {}
  
  // Check each product individually
  for (const productId of productIds) {
    try {
      const hasAccess = await sdk.access.checkIfUserHasAccessToProduct({
        userId,
        productId,
      })
      productAccess[productId] = hasAccess.hasAccess
    } catch (error) {
      // Failed to check access, default to false
      productAccess[productId] = false
    }
  }
  
  return productAccess
}
