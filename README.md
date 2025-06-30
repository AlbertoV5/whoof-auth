# Whoof - Auth

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.


## Create Get Authenticated User function

```ts
// Cache user authentication for the entire request
export const getAuthenticatedUser = cache(async (experienceId: string) => {
  const developerUserIds = ["user_nqcSNuC2wyKVx"]
  return getCachedUserAuthentication(
    whopSdk,
    experienceId,
    ({ userId, accessLevel }: { userId: string; accessLevel: any }) => {
      if (!accessLevel || accessLevel === "no_access") return null
      if (developerUserIds.includes(userId)) {
        return "developer"
      }
      if (accessLevel === "admin") {
        return "creator"
      }
      if (accessLevel === "customer") {
        return "user"
      }
      return null
    },
    async (headersList: Headers) => {
      const cronSecret = headersList.get("Authorization")?.split(" ")[1]
      if (cronSecret) {
        if (cronSecret !== env.CRON_SECRET) {
          throw new Error("Unauthorized")
        }
        return {
          userData: {
            userId: "system",
            userStatus: "developer",
            userAccessLevel: "admin",
          },
          cronSecret,
        }
      }
      return null
    }
  )
})
```

## Create Higher Order Function

```ts
export function Authenticated<Inputs extends Record<string, any>, Output>(
  options: CredentialsOptions,
  wrapped: (inputProps: AuthenticatedProps<Inputs>) => Promise<Output>
) {
  return async (rawProps?: Inputs & { experienceId?: string }) => {
    const props = rawProps || ({} as Inputs)
    const experienceId = rawProps?.experienceId || getExperienceId()
    const user = await getAuthenticatedUser(experienceId)
    if (!user) {
      throw new Error("Unauthorized")
    }
    const { requiredAccessLevel, requiredUserStatus } = options
    if (requiredAccessLevel && user.userAccessLevel !== requiredAccessLevel) {
      throw new Error("Unauthorized, access level mismatch")
    }
    if (requiredUserStatus && user.userStatus !== requiredUserStatus) {
      throw new Error("Unauthorized, user status mismatch")
    }
    return wrapped({ ...props, userData: user, experienceId })
  }
}

```