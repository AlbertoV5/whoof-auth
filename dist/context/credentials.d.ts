import type { Sdk } from "@whop/api";
/** Developer are "super-admin" users */
export type UserAppStatus = "creator" | "user" | "developer";
export type WhopExperienceAccessLevel = "admin" | "customer" | "no_access";
export type UserData = {
    userId: string;
    userStatus: UserAppStatus;
    userAccessLevel: WhopExperienceAccessLevel;
};
export type AuthenticatedProps<InputProps extends Record<string, any>> = InputProps & {
    userData: UserData;
    experienceId: string;
    cronSecret?: string;
    skipUserFetching?: boolean;
};
export type CredentialsOptions = {
    requiredUserStatus?: UserAppStatus;
    requiredAccessLevel?: WhopExperienceAccessLevel;
};
export type PreUserAuthResult = {
    userData: UserData;
    cronSecret?: string;
};
export type AuthenticationConfig = {
    sdk: Sdk;
    preUserAuth?: (headersList: Headers) => Promise<PreUserAuthResult | null>;
    getUserStatus: (params: {
        userId: string;
        accessLevel: WhopExperienceAccessLevel;
    }) => UserAppStatus | null;
};
export declare function createAuthenticationFunction(config: AuthenticationConfig): <Inputs extends Record<string, any>, Output>(options: CredentialsOptions, wrapped: (inputProps: AuthenticatedProps<Inputs>) => Promise<Output>) => (props?: Inputs & {
    experienceId?: string;
}) => Promise<Output>;
