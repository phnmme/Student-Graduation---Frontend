import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User, UserDetail } from "@/action/backend/usersAction";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ชม. ที่แล้ว`;
  return `${Math.floor(hours / 24)} วันที่แล้ว`;
}

export function getInitial(user: UserDetail | User): string {
  const name =
    "profile" in user && user.profile
      ? `${user.profile.firstNameTh} ${user.profile.lastNameTh}`
      : user.email;
  return name.charAt(0).toUpperCase();
}
