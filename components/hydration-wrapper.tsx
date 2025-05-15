"use client";

import { useEffect, useState } from "react";

export default function HydrationWrapper({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null; // Evitar problemas de hidratación
  }

  return <>{children}</>;
}