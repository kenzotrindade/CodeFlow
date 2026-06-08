import Link from "next/link";

// #################################
// ### Home Page
// #################################

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="relative mb-12">
        <h1 className="text-7xl md:text-[10rem] font-black italic tracking-tighter mix-diff leading-none">
          CODE
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "2px white" }}
          >
            FLOW
          </span>
        </h1>
        <div className="absolute -top-4 -right-12 text-pink-500 font-mono text-xs rotate-12 bg-white/5 px-3 py-1 backdrop-blur-md border border-white/10 ">
          // NEW !
        </div>
      </div>

      <p className="max-w-xl text-center text-lg md:text-xl font-light leading-relaxed text-purple-200/60 mb-16">
        L'apprentissage technique redéfini par la géométrie. Explorez, brisez
        les codes, et reconstruisez votre savoir à travers nos prismes
        interactifs.
      </p>

      <div className="flex flex-wrap justify-center gap-8 mb-24">
        <Link href="/dashboard" className="btn-prism">
          Explorer le flux
        </Link>
        <Link href="/techwatch" className="btn-prism-outline">
          Tech Watch
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {[
          {
            title: "Génération IA",
            desc: "Des exercices sculptés pour votre niveau.",
            icon: "01",
          },
          {
            title: "Veille Tech",
            desc: "Ne manquez aucun fragment de l'actualité.",
            icon: "02",
          },
          {
            title: "Progression",
            desc: "Visualisez votre évolution cristalline.",
            icon: "03",
          },
        ].map((item, i) => (
          <div key={i} className="card-fragment group cursor-default">
            <span className="text-6xl font-black opacity-5 group-hover:opacity-20 transition-opacity absolute top-4 right-4 italic">
              {item.icon}
            </span>
            <h3 className="text-xl font-bold uppercase tracking-tighter mb-4 text-pink-500">
              {item.title}
            </h3>
            <p className="text-sm text-purple-100/50 leading-loose">
              {item.desc}
            </p>
            <div className="h-px w-0 group-hover:w-full bg-linear-to-r from-pink-500 to-transparent transition-all duration-700 mt-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
