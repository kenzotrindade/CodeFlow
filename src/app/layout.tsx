import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

// #################################
// ### Global Layout
// #################################

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Navbar></Navbar>
          {children}
        </Providers>
      </body>
    </html>
  );
}
