import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      schoolId: {
        type: "string",
        required: false,
        input: false,
      },
      gradeLevel: {
        type: "number",
        required: false,
        input: false,
      },
      role: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "user",
      },
    },
  },
   plugins: [nextCookies()] 
});
