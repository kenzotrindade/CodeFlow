import Link from "next/link";
import { Zap, TrendingUp, Cpu, Globe } from "lucide-react";

// #################################
// ### Home Page
// #################################

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mb-24 text-center">
        <div className="relative inline-block mb-12">
          <h1 className="text-7xl md:text-[12rem] font-black italic tracking-tighter mix-diff leading-none select-none">
            CODE
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px white" }}
            >
              FLOW
            </span>
          </h1>
          <div className="absolute -top-4 -right-16 text-pink-500 font-mono text-sm rotate-12 bg-white/5 px-4 py-1 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            // VERSION 2.0
          </div>
        </div>

        <p className="max-w-2xl mx-auto text-center text-lg md:text-2xl font-light leading-relaxed text-purple-200/70 mb-16 px-4">
          L'écosystème ultime pour forger vos compétences.
          <span className="text-white font-medium block mt-2">
            Générez des défis, analysez le flux, maîtrisez la machine.
          </span>
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          <Link href="/dashboard" className="btn-prism group relative">
            <span className="relative z-10 flex items-center gap-2">
              Lancer l'expérience <Zap className="w-4 h-4 fill-current" />
            </span>
          </Link>
          <Link
            href="/techwatch"
            className="btn-prism-outline hover:border-pink-500 transition-all"
          >
            Explorer la veille
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mb-32 relative z-10">
        {[
          {
            title: "Architecture IA",
            desc: "Algorithmes génératifs entraînés pour sculpter des exercices sur-mesure selon votre stack.",
            icon: <Cpu className="w-8 h-8 text-pink-500" />,
            index: "01",
          },
          {
            title: "Veille Fractale",
            desc: "Un flux continu des meilleures ressources techniques agrégées depuis l'épicentre du web.",
            icon: <Globe className="w-8 h-8 text-pink-500" />,
            index: "02",
          },
          {
            title: "Analyse Cristalline",
            desc: "Visualisez votre progression avec des statistiques précises sur votre vitesse et précision.",
            icon: <TrendingUp className="w-8 h-8 text-pink-500" />,
            index: "03",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="card-fragment group cursor-default p-8 hover:bg-white/[0.04] transition-all"
          >
            <span className="text-8xl font-black opacity-[0.03] group-hover:opacity-[0.08] transition-opacity absolute -bottom-4 -right-4 italic select-none">
              {item.index}
            </span>
            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
              {item.icon}
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tighter mb-4 text-white group-hover:text-pink-500 transition-colors">
              {item.title}
            </h3>
            <p className="text-base text-purple-100/50 leading-relaxed relative z-10">
              {item.desc}
            </p>
            <div className="h-px w-0 group-hover:w-full bg-linear-to-r from-pink-500 to-transparent transition-all duration-700 mt-8" />
          </div>
        ))}
      </section>

      {/* Philosophy Section */}
      <section className="w-full max-w-7xl mb-32 border-y border-white/5 py-20 flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1">
          <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-8">
            Plus qu'un <br />
            <span className="text-pink-500">Simple Code.</span>
          </h2>
          <div className="space-y-6 text-purple-200/60 text-lg leading-relaxed">
            <p>
              Nous croyons que l'apprentissage est un processus géométrique.
              Chaque ligne de code est un segment, chaque fonction une forme,
              chaque application un prisme.
            </p>
            <p>
              CodeFlow n'est pas qu'une plateforme d'exercice. C'est un
              accélérateur de particules intellectuelles conçu pour les
              développeurs qui ne se contentent pas de copier, mais qui veulent
              comprendre la structure même du flux.
            </p>
          </div>
          <div className="mt-12 flex gap-12">
            <div>
              <div className="text-4xl font-black text-white">99%</div>
              <div className="text-xs uppercase tracking-widest text-pink-500 font-bold mt-1">
                Précision IA
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">24/7</div>
              <div className="text-xs uppercase tracking-widest text-pink-500 font-bold mt-1">
                Veille Active
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">∞</div>
              <div className="text-xs uppercase tracking-widest text-pink-500 font-bold mt-1">
                Possibilités
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 relative group">
          <div className="w-full aspect-square border border-white/10 relative overflow-hidden bg-white/[0.02]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-pink-500 rotate-45 group-hover:rotate-[225deg] transition-all duration-[2000ms] ease-in-out relative">
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white" />
              </div>
              <div className="absolute w-32 h-32 border-2 border-purple-500 -rotate-45 group-hover:rotate-180 transition-all duration-[2500ms] ease-in-out">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/20 uppercase tracking-[0.5em]">
              System_Status: Operational
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-500/20 blur-3xl rounded-full" />
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center bg-linear-to-b from-transparent to-pink-500/5 w-full py-24 rounded-3xl border border-white/5">
        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-12">
          Prêt à briser <br />
          le <span className="text-pink-500">statu quo ?</span>
        </h2>
        <Link
          href="/register"
          className="btn-prism scale-125 hover:scale-135 transition-transform"
        >
          Rejoindre le flux
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-32 w-full max-w-7xl pt-12 border-t border-white/5 flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
        <div>© 2026 CODEFLOW ARCHITECTURE</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">
            Github
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Documentation
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Legal
          </a>
        </div>
      </footer>
    </div>
  );
}
