// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

export function filterByName<T extends { name: string }>(items: T[], query: string): T[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(item => item.name.toLowerCase().includes(q));
}