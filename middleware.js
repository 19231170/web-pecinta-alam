import { auth } from "@/auth";

export default auth;

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/anggota/:path*", "/template/:path*"],
};