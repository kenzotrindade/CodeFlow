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

      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
