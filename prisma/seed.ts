import { PrismaClient } from "@prisma/client";

// #################################
// ### Seeding DB
// #################################

const prisma = new PrismaClient();

async function main() {
  const languages = [
    { name: "JavaScript", slug: "javascript" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Python", slug: "python" },
    { name: "Java", slug: "java" },
    { name: "C#", slug: "csharp" },
    { name: "Go", slug: "go" },
    { name: "Rust", slug: "rust" },
    { name: "C++", slug: "cpp" },
    { name: "PHP", slug: "php" },
    { name: "Swift", slug: "swift" },
  ];

  console.log("Starting seed...");

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { slug: lang.slug },
      update: {},
      create: lang,
    });
  }

  console.log("Seed finished.");
}

main();
