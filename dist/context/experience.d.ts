interface ServerContext {
    experienceId: string;
    userId?: string;
}
/**
 * Runs a function with the experienceId in async context
 * This should be called at the top level of your request handling
 */
export declare function withExperienceContext<T>(experienceId: string, fn: () => T, userId?: string): T;
/**
 * Gets the current experienceId from async context
 * Similar to how await headers() works
 */
export declare function getExperienceId(): string;
/**
 * Gets the current userId from async context (if available)
 */
export declare function getUserId(): string | undefined;
/**
 * Gets the full context (useful for optional access)
 */
export declare function getContext(): ServerContext | undefined;
/**
 * Checks if we're currently in an experience context
 */
export declare function hasExperienceContext(): boolean;
export {};
