/** Whether the group is currently taking new members. */
export type MemberStatus = {
  accepting: boolean;
  /** ISO date after which we stop taking requests, if there's a cutoff. */
  closesAt?: string;
  /** Short note for chips / cards. */
  note?: string;
};

export const memberStatus: MemberStatus = {
  accepting: true,
  note: "Sessions run regularly. Share your work, get real feedback.",
};

// Keep for any date formatting needs
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export function formatShortDate(iso: string): string {
  const [, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  if (!m || !d) return iso;
  return `${MONTHS_SHORT[m - 1]} ${d}`;
}
