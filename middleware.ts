export { auth as default } from "@/lib/auth-edge";

export const config = {
  matcher: ["/dashboard", "/techwatch", "/account", "/exercise/:path*"],
};
