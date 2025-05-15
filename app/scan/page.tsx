"use client";

import { useAuth } from "@/components/auth-provider";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import QrScanner from "@/components/qr-scanner";

export default function ScanPage() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/auth/signin");
    }
  }, [isLoading, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Scan Plant QR Code</h1>
        <p className="text-muted-foreground mb-6 text-center">
          Scan a plant QR code to view its watering information
        </p>
        <QrScanner />
      </div>
    </div>
  );
}