"use client";

import { ReactNode, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

type GuestGuardProps = {
  children: ReactNode;
};

const emptySubscribe = () => () => {};

export default function GuestGuard({
  children,
}: GuestGuardProps) {
  const router = useRouter();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/portal");
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  if (isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}