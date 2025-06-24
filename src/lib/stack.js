import "server-only";
import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/auth/signin",
    afterSignIn: "/",
    afterSignUp: "/onboarding",
    afterSignOut: "/auth/signin"
  }
});

// Helper function to get authenticated user
export async function getUser(request = null) {
  try {
    if (request) {
      return await stackServerApp.getUser({ request });
    } else {
      return await stackServerApp.getUser();
    }
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}