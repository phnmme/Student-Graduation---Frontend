// ─── Re-export from action types ─────────────────────────────────────────────
export type {
  User,
  UserDetail,
  GetUsersParams,
} from "@/action/backend/usersAction";

// ─── Local Types ──────────────────────────────────────────────────────────────

export type RoleFilter = "USER" | "ADMIN" | "all";
export type ProfileFilter = "all" | "with" | "without";

export interface ToastState {
  msg: string;
  type: "success" | "error";
}

export const LIMIT = 10;

export const SECTOR_LABEL: Record<string, string> = {
  GOVERNMENT: "ราชการ / รัฐวิสาหกิจ",
  PRIVATE: "เอกชน",
  OWN_BUSINESS: "ธุรกิจส่วนตัว",
  NOT_EMPLOYED: "ยังไม่ได้ทำงาน",
};
