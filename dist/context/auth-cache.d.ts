import type { Sdk } from "@whop/api";
import type { UserData, UserAppStatus, WhopExperienceAccessLevel, PreUserAuthResult } from "./credentials";
export declare const getCachedUserToken: () => Promise<import("@whop/api").UserTokenPayload>;
export declare const getCachedUserAccess: (sdk: Sdk, userId: string, experienceId: string) => Promise<{
    __typename?: "HasAccessResult";
    hasAccess: boolean;
    accessLevel: import("@whop/api").AccessLevel;
}>;
export declare const getCachedUserAuthentication: (sdk: Sdk, experienceId: string, getUserStatus: (params: {
    userId: string;
    accessLevel: WhopExperienceAccessLevel;
}) => UserAppStatus | null, preUserAuth?: (headersList: Headers) => Promise<PreUserAuthResult | null>) => Promise<UserData | null>;
