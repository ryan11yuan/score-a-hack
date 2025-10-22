import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { SCORE_THRESHOLDS } from "./constants"
import { backOff } from "exponential-backoff";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getScoreColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.HIGH) return "text-success"
  if (score >= SCORE_THRESHOLDS.MEDIUM) return "text-warning"
  return "text-error"
}

export function getScoreBgColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.HIGH) return "bg-success/10"
  if (score >= SCORE_THRESHOLDS.MEDIUM) return "bg-warning/10"
  return "bg-error/10"
}

export function getScoreBand(score: number): "High" | "Medium" | "Low" {
  if (score >= SCORE_THRESHOLDS.HIGH) return "High"
  if (score >= SCORE_THRESHOLDS.MEDIUM) return "Medium"
  return "Low"
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date))
}

const useBackOff = async (func: () => Promise<any>) => {
  return await backOff(async () => {
    try {
      return await func();
    } catch (err) {
      return Promise.reject(err);
    }
  }, {
    numOfAttempts: 20,
    timeMultiple: 1.05
  })
    .catch(console.error);
};

export default useBackOff;