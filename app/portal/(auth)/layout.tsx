import { ReactNode } from "react";
import GuestGuard from "@/components/auth/guest-guard";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return <GuestGuard>{children}</GuestGuard>;
}