export const prompts = {
  exercise_generation: {
    system_persona: `Tu es un Mentor Senior en programmation. Ton but est de forger des développeurs d'élite. 
    Tu ne donnes pas juste des exercices, tu crées des défis qui forcent à comprendre les concepts en profondeur.
    Tu analyses l'historique de l'élève pour identifier les lacunes et augmenter la complexité de manière chirurgicale.`,

    level_guidelines: {
      javascript: {
        EASY: "Focus: Variables (let/const), Types primitifs, Boucles simples, Fonctions fléchées.",
        MEDIUM: "Focus: Manipulation d'objets complexes, Méthodes d'Array (map/reduce/filter), Destructuring, Promesses (Async/Await).",
        HARD: "Focus: Closures, Prototypes, Gestion d'erreurs avancée, Programmation fonctionnelle, Event Loop.",
        EXPERT: "Focus: Design Patterns (Module, Factory), Gestion de la mémoire, Performance (O notation), Web Workers, Proxy/Reflect."
      },
      typescript: {
        EASY: "Focus: Types de base, Interfaces simples, Enums, Type aliases.",
        MEDIUM: "Focus: Generics de base, Union/Intersection types, Utility Types (Partial, Pick), Interfaces complexes.",
        HARD: "Focus: Advanced Generics, Mapped Types, Conditional Types, Type Guards, Décorateurs.",
        EXPERT: "Focus: Polymorphisme de types, Variadic Tuple Types, Architecture Hexagonale avec TS, Manipulation du compilateur (Infer)."
      },
      python: {
        EASY: "Focus: Listes, Dictionnaires, List Comprehension, Fonctions, Gestion de fichiers.",
        MEDIUM: "Focus: Décorateurs simples, Context Managers (with), Programmation Orientée Objet (Classes/Héritage), Exceptions.",
        HARD: "Focus: Multi-threading vs Multi-processing, Metaclasses, Descripteurs, Itérateurs/Générateurs complexes.",
        EXPERT: "Focus: Optimisation via Cython/C-extensions, Architecture Asynchrone (Asyncio), Design Patterns avancés, Analyse de Bytecode."
      },
      general: {
        EASY: "Notions de base : syntaxe, logique simple, types.",
        MEDIUM: "Algorithmique moyenne, structures de données standard, asynchronisme.",
        HARD: "Architecture de code, optimisation, paradigmes avancés.",
        EXPERT: "Systèmes complexes, bas niveau, scalabilité, sécurité."
      }
    },

    progressive_template: `
    ### CONTEXTE MENTORAT
    Langage : {{language}}
    Niveau visé : {{difficulty}}
    Règles spécifiques au niveau : {{level_rules}}

    ### HISTORIQUE DE L'ÉLÈVE
    {{last_exercises}}

    ### MISSION DU MENTOR
    1. Analyse l'historique ci-dessus. Si l'élève a réussi facilement, augmente la difficulté. S'il stagne, change d'approche pédagogique.
    2. Crée un exercice qui introduit une NOUVELLE notion par rapport aux précédents.
    3. L'énoncé doit être immersif (contexte réel de travail).

    ### FORMAT JSON ATTENDU
    {
      "title": "Titre du défi",
      "statement": "Énoncé détaillé avec contexte métier",
      "expectedOutput": "Description du résultat attendu",
      "notion": "La notion précise enseignée ici"
    }`,

    capstone_template: `
    ### PROJET DE SYNTHÈSE (CAPSTONE)
    Langage : {{language}}
    Niveau global : {{difficulty}}
    
    ### ANALYSE DE PROGRESSION
    {{last_exercises}}

    ### MISSION DU MENTOR
    L'élève termine un module. Tu dois concevoir un projet 'Crystalline' qui combine TOUTES les notions vues précédemment.
    Ce n'est pas un exercice, c'est une mini-application ou une librairie à construire.
    La difficulté EXPERT doit demander une réflexion architecturale (séparation des préoccupations, robustesse).

    ### FORMAT JSON ATTENDU
    {
      "title": "Titre du Projet",
      "statement": "Cahier des charges complet et complexe",
      "expectedOutput": "Critères d'acceptation techniques",
      "notion": "Synthèse globale"
    }`
  },

  techwatch_generation: {
    template: `
    ### VEILLE TECH VERS DÉFI
    Convertis cet article en un défi pratique.
    Article : {{article_title}}
    Description : {{article_description}}
    Langage cible : {{language}}

    Tu dois extraire la substantifique moelle technique de l'article pour en faire un exercice.
    Format JSON : { "title": "...", "statement": "...", "expectedOutput": "...", "notion": "..." }`
  }
};
