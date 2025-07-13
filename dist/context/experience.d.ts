import type { Sdk } from "@whop/api";
export type WhopExperience = Awaited<ReturnType<Sdk["experiences"]["getExperience"]>>;
export interface ServerContext {
    experienceId: string;
    userId?: string;
    experience?: WhopExperience;
}
/**
 * Runs a function with the experienceId in async context
 * This should be called at the top level of your request handling
 * If experienceFetcher is provided, it will fetch the experience if not already cached
 * The view function receives the experience object directly
 */
export declare function withExperience<T>(options: {
    sdk: Sdk;
    experienceId: string;
    view: (experience: WhopExperience) => T | Promise<T>;
    userId?: string;
    experience?: WhopExperience;
}): Promise<T>;
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
 * Gets the cached experience from async context
 * Returns undefined if no experience is cached
 */
export declare function getCachedExperience(): WhopExperience | undefined;
/**
 * Sets the experience in the current context
 * This is useful for caching the experience after fetching it
 */
export declare function setCachedExperience(experience: WhopExperience): void;
/**
 * Gets the cached experience or fetches it using the provided fetcher function
 * The fetcher function receives the experienceId and should return the experience
 * If there's an error fetching, it will be thrown
 */
export declare function getOrFetchExperience<T extends WhopExperience>(fetcher: (experienceId: string) => Promise<T | null>): Promise<T>;
/**
 * Gets the full context (useful for optional access)
 */
export declare function getContext(): ServerContext | undefined;
/**
 * Checks if we're currently in an experience context
 */
export declare function hasExperienceContext(): boolean;
/**
 * Gets the cached experience or throws an error if not available
 * This is useful when you know the experience should be cached (e.g., after layout has run)
 */
export declare function getExperience(): WhopExperience;
