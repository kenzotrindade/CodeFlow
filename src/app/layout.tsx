import "./globals.css";
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
        <Navbar></Navbar>
        {children}
        </body>
    </html>
  );
}
