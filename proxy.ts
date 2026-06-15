// #################################
// ### Middleware
// #################################

export const config = {
  matcher: ["/dashboard", "/techwatch", "/account", "/exercise/:path*"],
};

export { auth as default } from "@/lib/auth";
