import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

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
      <body className="relative">
        <SessionProviderWrapper>
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="prisma-shape w-[500px] h-[500px] top-[-10%] right-[-5%] rotate-12 opacity-30" />
            <div className="prisma-shape w-[600px] h-[600px] bottom-[-10%] left-[-10%] -rotate-12 opacity-20" />

            <svg
              className="absolute inset-0 w-full h-full opacity-[0.03]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-100 100 Q 150 300 500 100 T 1200 400"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M-100 800 Q 400 600 800 900 T 1500 700"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M200 -100 L 800 1200"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                strokeDasharray="5,5"
              />
            </svg>
          </div>

          <Navbar />
          <main className="relative z-10 pt-24 pb-12">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
