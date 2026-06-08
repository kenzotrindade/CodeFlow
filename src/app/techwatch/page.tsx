import prisma from "@/lib/prisma";
import TechWatchList from "@/components/TechWatchList";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// #################################
// ### Techwatch Page
// #################################

export default async function TechWatchPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ tag?: string }>;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { tag } = await searchParams;
  const currentTag = tag || "javascript";
  const res = await fetch(
    `https://dev.to/api/articles?tag=${currentTag}&per_page=9`,
    {
      next: { revalidate: 3600 },
    },
  );

  const articles = await res.json();
  const languages = await prisma.language.findMany();

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="mb-20">
        <h1 className="text-6xl font-black italic tracking-tighter mix-diff uppercase mb-2">
          TECH WATCH
        </h1>
        <div className="h-1 w-24 bg-pink-500 mb-6" />
        <p className="text-purple-200/50 font-mono text-sm tracking-widest uppercase">
          Extraction de flux externes en temps réel
        </p>
      </div>

      <TechWatchList
        articles={Array.isArray(articles) ? articles : []}
        languages={languages}
        currentTag={currentTag}
      />
    </div>
  );
}
