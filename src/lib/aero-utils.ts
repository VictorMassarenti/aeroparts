export function generateId(): string {
  return crypto.randomUUID();
}

export function formatSequence(prefix: string, num: number): string {
  return `${prefix}-${num.toString().padStart(4, "0")}`;
}

export function getAgingBucket(dueDate: string): "0-30" | "31-60" | "61+" {
  const due = new Date(dueDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 30) return "0-30";
  if (diffDays <= 60) return "31-60";
  return "61+";
}
