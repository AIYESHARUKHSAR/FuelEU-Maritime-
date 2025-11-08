export function validateApply(amount: number, available: number) {
  if (amount <= 0) throw new Error("Amount must be positive");
  if (amount > available) throw new Error("Amount exceeds available banked surplus");
  return true;
}
