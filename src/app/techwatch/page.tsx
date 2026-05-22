import prisma from "@/lib/prisma";
import TechWatchList from "@/components/TechWatchList";

export default async function TechWatchPage() {
  const res = await fetch(
    "https://dev.to/api/articles?tag=programming&per_page=9",
    { next: { revalidate: 3600 } },
  );

  const articles = await res.json();
  const languages = await prisma.language.findMany();

  return (
    <div>
      <h1>Techwatch</h1>
      <TechWatchList articles={articles} languages={languages} />
    </div>
  );
}
