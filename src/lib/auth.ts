import NextAuth from "next-auth";

// #################################
// ### Auth Settings
// #################################

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
});
