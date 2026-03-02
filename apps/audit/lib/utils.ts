import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const logger = {
  info: (message: string, context: object = {}) => {
    console.log(JSON.stringify({ message, ...context }));
  },
  warn: (message: string, context: object = {}) => {
    console.warn(JSON.stringify({ message, ...context }));
  },
  error: (message: string, context: object = {}) => {
    console.error(JSON.stringify({ message, ...context }));
  },
};
