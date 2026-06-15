export { auth as default } from "./src/lib/auth-edge";

export const config = {
  matcher: ["/dashboard", "/techwatch", "/account", "/exercise/:path*"],
};
