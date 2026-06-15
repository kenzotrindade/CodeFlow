<div align="center">

# ⚡ CodeFlow - Mentorat Technique IA

![Next.js](https://img.shields.io/badge/Framework-Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Database-Prisma-0C344B?style=for-the-badge&logo=prisma&logoColor=white)
![OpenAI](https://img.shields.io/badge/AI-OpenAI_Llama-6A0DAD?style=for-the-badge&logo=openai&logoColor=white)

<p>
  <strong>Un écosystème d'apprentissage adaptatif piloté par IA</strong><br>
  Forgez vos compétences avec des exercices générés sur-mesure, audités en temps réel et des défis techniques immersifs.
</p>

</div>

---

## 📝 À propos du projet

**CodeFlow** est une plateforme de mentorat technique nouvelle génération. Oubliez les exercices génériques et statiques : CodeFlow utilise l'intelligence artificielle pour concevoir des parcours d'apprentissage qui évoluent avec vous. Que vous soyez débutant ou expert, Lumina, votre mentor IA, analyse vos forces et vos faiblesses pour générer des missions concrètes, professionnelles et stimulantes.

---

## ⚙️ Fonctionnalités clés

*   **⚡ Génération Contextuelle :** Des exercices créés dynamiquement selon votre historique, votre langage et votre niveau.
*   **🧠 Mentor IA (Lumina) :** Audit de code en temps réel, feedback incisif et indices pédagogiques progressifs.
*   **🚀 Mode Capstone (Défi) :** Déclenchement de projets de synthèse immersifs pour valider vos acquis en conditions réelles.
*   **📊 Suivi de progression :** Visualisez l'évolution de vos séquences validées et vos défis techniques.
*   **🛠️ Éditeur Prisme :** Un environnement de codage intégré, géométrique et optimisé pour le focus.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Langage** | TypeScript |
| **Styling** | Tailwind CSS |
| **ORM** | Prisma |
| **Intelligence Artificielle** | OpenAI / Llama 3.3 (via Groq) |
| **Auth** | NextAuth.js |
| **Editor** | Monaco Editor |

---

## 🚀 Lancer le projet

### Prérequis
*   Node.js 20+
*   Une base de données PostgreSQL (ou compatible)
*   Une clé API OpenAI / Groq

### Installation

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/votre-utilisateur/code_flow.git
   ```
2. **Installer les dépendances :**
   ```bash
   npm install
   ```
3. **Configurer les variables d'environnement :**
   Copiez `.env.example` vers `.env` et configurez vos clés (BDD, NextAuth, OpenAI).
4. **Initialiser la base de données :**
   ```bash
   npx prisma db push
   ```
5. **Lancer en développement :**
   ```bash
   npm run dev
   ```

---

## 📂 Structure du projet

*   `src/app/`: Routes de l'application et pages principales.
*   `src/app/actions/`: Logiques serveur (Génération IA, Validation, Utilisateur).
*   `src/components/`: Composants UI réutilisables (Monaco Editor, Dashboard, Modales).
*   `src/lib/`: Utilitaires, typages, configuration Prisma et système de prompts IA.
*   `prisma/`: Schéma de base de données et migrations.
