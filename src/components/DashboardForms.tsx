"use client";
import { Language, Difficulty } from "@prisma/client";

export default function DashboardForms({
  languages,
  difficulties,
}: {
  languages: Language[];
  difficulties: string[];
}) {
  return (
    <div>
      <select className="border p-2 rounded text-black">
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
      <select className="border p-2 rounded text-black">
        {difficulties.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Générer
      </button>
    </div>
  );
}
