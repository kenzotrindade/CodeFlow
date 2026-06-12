import prisma from "@/lib/prisma";
import TechWatchList from "@/components/TechWatchList";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

// #################################
// ### Techwatch Page SEO
// #################################

export const metadata: Metadata = {
  title: "Veille Tech | CodeFlow",
  description: "Flux de veille technologique en temps réel transformé en modules d'apprentissage pratiques.",
};

export default async function TechWatchPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ tag?: string }>;
}>) {
  const session = await auth();
  if (!session) redirect("/login");

  const { tag } = await searchParams;
  const currentTag = tag || "javascript";

  const res = await fetch(`https://dev.to/api/articles?tag=${currentTag}&per_page=12`, {
    next: { revalidate: 3600 },
  });

  const articles = await res.json();
  const languages = await prisma.language.findMany();

  return (
    <main className="container mx-auto px-6 max-w-[1900px] pt-12">
      <TechWatchList
        articles={Array.isArray(articles) ? articles : []}
        languages={languages}
        currentTag={currentTag}
      />
    </main>
  );
}
