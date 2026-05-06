import "./globals.css";
import { Navbar } from "@/components/Navbar";
import SessionWrapper from "@/lib/SessionWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="fr">
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}
