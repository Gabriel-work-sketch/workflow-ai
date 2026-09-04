import { useEffect, useState } from "react";

export type AppSettings = {
  defaultTone: "Formal" | "Friendly" | "Persuasive";
  accent: "blue" | "teal" | "violet";
  notifications: boolean;
  emailDigest: boolean;
  responseLength: "short" | "balanced" | "detailed";
};

export const defaultSettings: AppSettings = {
  defaultTone: "Formal",
  accent: "blue",
  notifications: true,
  emailDigest: false,
  responseLength: "balanced",
};

const KEY = "awpa:settings";
const AUTH_KEY = "awpa:user";

export function readSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    return { ...defaultSettings, ...(JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<AppSettings>) };
  } catch {
    return defaultSettings;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    setSettings(readSettings());
  }, []);

  const update = (patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return { settings, update };
}

export type SessionUser = { name: string; email: string };

export function signIn(user: SessionUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function signOut() {
  localStorage.removeItem(AUTH_KEY);
}

export function readUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}
