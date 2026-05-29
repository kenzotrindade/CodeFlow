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

export default function AccountForm({ user }: AccountFormProps) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const passwordRules = [
    { label: "12+ characters", test: (pw) => pw.length >= 12 },
    { label: "Uppercase", test: (pw) => /[A-Z]/.test(pw) },
    { label: "Lowercase", test: (pw) => /[a-z]/.test(pw) },
    { label: "Number", test: (pw) => /[0-9]/.test(pw) },
    { label: "Special character", test: (pw) => /[@$!%*?&]/.test(pw) },
  ];

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const result = await updateAccount({ name, email, password });
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Username</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isPending}
      />
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
      />
      <label>Password</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        disabled={isPending}
      />

      <div className="mt-2 space-y-1">
        {passwordRules.map((rule, i) => {
          const isOk = rule.test(password);
          return (
            <div
              key={i}
              className={`text-xs flex items-center gap-1 ${isOk ? "text-green-600" : "text-gray-800"}`}
            >
              <span>
                {isOk ? (
                  <span>{rule.label + " OK"}</span>
                ) : (
                  <span>{rule.label + " NO"}</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
