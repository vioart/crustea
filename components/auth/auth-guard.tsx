"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const authenticated = isAuthenticated();

    if (!authenticated) {
      router.replace("/portal/login");
      return;
    }

    queueMicrotask(() => {
      setChecking(false);
    });
  }, [router]);

  if (checking) {
    return null;
  }

  return <>{children}</>;
}