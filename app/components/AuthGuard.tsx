'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("http://localhost:8080/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return <>{children}</>;
};

export default AuthGuard;
