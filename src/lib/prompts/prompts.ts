export const prompts = {
  exercise_generation: {
    system_persona: "Tu es Lumina, une tutrice experte en pédagogie informatique. Tu parles avec clarté, rigueur et empathie. Ta mission est de faire progresser l'utilisateur avec une exigence croissante et une cohérence totale.",
    level_guidelines: {
      javascript: {
        EASY: "Bases : Variables (const/let), types primitifs, boucles (for/while), conditions (if/else/switch), fonctions simples. Pas de DOM complexe, pas d'asynchrone.",
        MEDIUM: "Structuration : Objets, Tableaux (map/filter/reduce), Closures, asynchrone basique (Promises), manipulation DOM intermédiaire, gestion d'erreurs (try/catch).",
        HARD: "Complexité : Programmation Fonctionnelle vs POO, Async/Await complexe, Event Loop, Design Patterns simples, Logique de mini-moteur ou gestion d'état.",
        EXPERT: "Senior : Architecture modulaire, Optimisation de performance (V8), Gestion mémoire, Proxies, Meta-programming, Sécurité, Patterns SOLID et Clean Code."
      },
      typescript: {
        EASY: "Bases TS : Types primitifs, Interfaces simples, Types de fonctions, Inférence de base.",
        MEDIUM: "Types Avancés : Generics, Enums, Unions/Intersections, Type Guards, Utility Types (Partial, Pick, Omit).",
        HARD: "Complexité : Conditional Types, Mapped Types, Decorators, Generics complexes, Architecture de types stricte.",
        EXPERT: "Senior : Template Literal Types, Recursive Types, Type-level programming, Intégration avancée avec les environnements (Node/Browser), Performance des types."
      },
      python: {
        EASY: "Bases : Syntaxe, Listes, Dictionnaires, Boucles, Conditions, Fonctions standards.",
        MEDIUM: "Intermédiaire : List Comprehensions, Décorateurs simples, Gestion de fichiers, Classes (POO de base), Modules standard (math, datetime).",
        HARD: "Avancé : Multithreading/Asyncio, Context Managers, Metaclasses, Algorithmique complexe, Tests unitaires avancés.",
        EXPERT: "Senior : Optimisation (Cython/C-extensions), Architecture logicielle à grande échelle, Sécurité, Deep Internals de Python, Data Science avancée ou Backend haute performance."
      },
      java: {
        EASY: "Bases : Types, Boucles, Conditions, Classes simples, Méthodes.",
        MEDIUM: "POO : Héritage, Interfaces, Polymorphisme, Exceptions, Collections (List, Map).",
        HARD: "Avancé : Generics, Streams API, Lambda expressions, Multithreading (Threads/Runnables), JDBC/JPA de base.",
        EXPERT: "Senior : JVM Tuning, Design Patterns (Gang of Four), Concurrency avancée, Architecture Microservices, Spring Internals, Reflection."
      },
      go: {
        EASY: "Bases : Variables, Structs, Slices, Maps, Fonctions, Packages.",
        MEDIUM: "Concurrence : Interfaces, Pointers, Goroutines simples, Channels, Gestion d'erreurs idiomatique.",
        HARD: "Avancé : Select, WaitGroups, Context, Reflection, Optimisation de Garbage Collection, Benchmarking.",
        EXPERT: "Senior : Architecture de systèmes distribués, Patterns de concurrence complexes, Performance (Allocations), Internals du Runtime, Design de librairies robustes."
      },
      rust: {
        EASY: "Bases : Ownership, Borrowing, Enums (Option/Result), Pattern Matching, Structs.",
        MEDIUM: "Traits : Traits, Generics, Closures, Gestion d'erreurs (Iterators, combinators).",
        HARD: "Avancé : Lifetimes complexes, Smart Pointers (Box, Rc, Arc), Concurrence (Send/Sync), Macros déclaratives.",
        EXPERT: "Senior : Unsafe Rust, Pin/Poll, Macros de procédure, Optimisation bas niveau, Architecture système haute performance, FFI."
      },
      general: {
        EASY: "Les bases fondamentales du langage (variables, boucles, conditions).",
        MEDIUM: "Structuration du code, début de projets avec plusieurs composants, logique intermédiaire.",
        HARD: "Projets complexes, résolution de problèmes difficiles, intégration de multiples concepts avancés.",
        EXPERT: "Niveau Senior (plusieurs années d'expérience). Architecture, optimisation, bonnes pratiques industrielles et concepts très avancés."
      }
    },
    progressive_template: "CONTEXTE :\n{{system_persona}}\n\nLANGAGE : {{language}}\nDIFFICULTÉ : {{difficulty}}\n\nDIRECTIVES DE NIVEAU POUR {{language}} :\n{{level_rules}}\n\nHISTORIQUE UTILISATEUR :\n{{last_exercises}}\n\nMISSION :\nGénère un exercice qui respecte STRICTEMENT la difficulté {{difficulty}}. \n- Si {{difficulty}} est HARD, l'exercice doit être un vrai défi technique.\n- Si {{difficulty}} est EXPERT, il doit demander une réflexion de niveau ingénieur/senior.\n\nFORMAT DE RÉPONSE (JSON STRICT) :\n{\n  \"title\": \"Titre de l'exercice\",\n  \"statement\": \"Énoncé clair et détaillé\",\n  \"notion\": \"La notion principale travaillée\",\n  \"expectedOutput\": \"Ce que le code doit produire\",\n  \"isCapstone\": false\n}"
  },
  "techwatch_generation": {
    "template": "CONTEXTE :\n{{system_persona}}\n\nARTICLE SOURCE :\nTitre : {{article_title}}\nDescription : {{article_description}}\n\nLANGAGE CIBLE : {{language}}\n\nMISSION :\nAnalyse les concepts techniques de cet article et génère un exercice de programmation pratique pour les mettre en application.\nL'exercice doit être concret et permettre à l'utilisateur de tester ce qu'il vient de lire.\n\nFORMAT DE RÉPONSE (JSON STRICT) :\n{\n  \"title\": \"DÉFI VEILLE : [Titre]\",\n  \"statement\": \"Énoncé basé sur l'article\",\n  \"notion\": \"Concept clé de l'article\",\n  \"expectedOutput\": \"Résultat attendu\",\n  \"isCapstone\": false\n}"
  },
  "project_generation": {
    "capstone_template": "CONTEXTE :\n{{system_persona}}\n\nL'utilisateur a validé le niveau {{difficulty}} en {{language}}.\n\nDIRECTIVES DE PROJET POUR {{language}} :\n{{level_rules}}\n\nMISSION :\nGénère un PROJET FINAL (Capstone) qui synthétise les acquis du niveau {{difficulty}}. \nCe projet doit être ambitieux, complet et structuré comme un vrai mini-projet professionnel.\n\nFORMAT DE RÉPONSE (JSON STRICT) :\n{\n  \"title\": \"PROJET FINAL : [Nom]\",\n  \"statement\": \"Cahier des charges complet et étapes de réalisation\",\n  \"expectedOutput\": \"Comportement final attendu et critères de succès\",\n  \"isCapstone\": true\n}"
  }
};
