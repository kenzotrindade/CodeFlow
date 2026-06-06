"use client";

import { useState } from "react";
import { updateAccount } from "@/app/actions/user";

interface AccountFormProps {
  user: {
    name?: string | null;
    email?: string | null;
    password?: string | null;
  };
}

export default function AccountForm({ user }: Readonly<AccountFormProps>) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const passwordRules = [
    { label: "8+ caractères", test: (pw: string) => pw.length >= 12 },
    { label: "Majuscule", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "Minuscule", test: (pw: string) => /[a-z]/.test(pw) },
    { label: "Chiffre", test: (pw: string) => /[0-9]/.test(pw) },
    { label: "Symbole", test: (pw: string) => /[@$!%*?&]/.test(pw) },
  ];

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    try {
      await updateAccount({ name, email, password });
      setMessage({ type: "success", text: "Fragment mis à jour avec succès." });
    } catch (err) {
      setMessage({ type: "error", text: "Échec de la mise à jour." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div
          className={`p-4 text-[10px] font-bold uppercase tracking-widest border-l-4 ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500 text-green-200"
              : "bg-red-500/10 border-red-500 text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50">
            Alias Public
          </label>
          <input
            type="text"
            className="input-prism"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50">
            Email de liaison
          </label>
          <input
            type="email"
            className="input-prism"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50 block">
          Nouvelle clef d'accès (optionnel)
        </label>
        <input
          type="password"
          className="input-prism w-full"
          placeholder="Laisser vide pour conserver l'actuelle"
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />

        <div className="flex flex-wrap gap-4 mt-4">
          {passwordRules.map((rule, i) => {
            const isOk = rule.test(password);
            return (
              <div
                key={i}
                className={`text-[9px] uppercase tracking-tighter font-bold flex items-center gap-2 ${isOk ? "text-green-400" : "text-purple-100/10"}`}
              >
                <div
                  className={`w-1 h-1 rotate-45 ${isOk ? "bg-green-400" : "bg-purple-100/10"}`}
                />
                {rule.label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 flex justify-end">
        <button
          type="submit"
          className="btn-prism min-w-[200px]"
          disabled={isPending}
        >
          {isPending ? "SYNCHRONISATION..." : "ENREGISTRER"}
        </button>
      </div>
    </form>
  );
}
