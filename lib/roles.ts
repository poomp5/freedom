export type UserRole =
  | "user"
  | "admin"
  | "publisher"
  | "suspended"
  | "pending_publisher";

/** Extract role from a Better Auth session user object */
export function getUserRole(
  user: Record<string, unknown>
): string | undefined {
  return user.role as string | undefined;
}

export function isAdmin(role: string | undefined): boolean {
  return role === "admin";
}

export function isPublisher(role: string | undefined): boolean {
  return role === "publisher";
}

export function isSuspended(role: string | undefined): boolean {
  return role === "suspended";
}

export function canAccessDashboard(role: string | undefined): boolean {
  return role === "admin" || role === "publisher";
}
