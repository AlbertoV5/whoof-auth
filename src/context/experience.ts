import { AsyncLocalStorage } from "async_hooks"

// Define the context type
interface ServerContext {
  experienceId: string
  userId?: string
}

// Create the async local storage instance
const asyncLocalStorage = new AsyncLocalStorage<ServerContext>()

/**
 * Runs a function with the experienceId in async context
 * This should be called at the top level of your request handling
 */
export function withExperienceContext<T>(
  experienceId: string,
  fn: () => T,
  userId?: string
): T {
  const context: ServerContext = { experienceId, userId }
  return asyncLocalStorage.run(context, fn)
}

/**
 * Gets the current experienceId from async context
 * Similar to how await headers() works
 */
export function getExperienceId(): string {
  const context = asyncLocalStorage.getStore()
  if (!context?.experienceId) {
    throw new Error(
      "experienceId not found in context. Make sure you are calling this within withExperienceContext."
    )
  }
  return context.experienceId
}

/**
 * Gets the current userId from async context (if available)
 */
export function getUserId(): string | undefined {
  const context = asyncLocalStorage.getStore()
  return context?.userId
}

/**
 * Gets the full context (useful for optional access)
 */
export function getContext(): ServerContext | undefined {
  return asyncLocalStorage.getStore()
}

/**
 * Checks if we're currently in an experience context
 */
export function hasExperienceContext(): boolean {
  const context = asyncLocalStorage.getStore()
  return !!context?.experienceId
}
