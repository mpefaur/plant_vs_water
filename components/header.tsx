"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Leaf, Scan, Plus, Home, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center pl-4">
        <Link href="/" className="flex items-center gap-4">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="font-medium hidden md:inline-block">Plants vs Water</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2 mx-6">
          <Link href="/">
            <Button 
              variant={isActive("/") ? "default" : "ghost"} 
              size="sm"
            >
              Home
            </Button>
          </Link>
          {user && (
            <>
              <Link href="/scan">
                <Button 
                  variant={isActive("/scan") ? "default" : "ghost"} 
                  size="sm" 
                  className="text-xs md:text-sm"
                >
                  <Scan className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Scan</span>
                </Button>
              </Link>
              <Link href="/plants/new">
                <Button 
                  variant={isActive("/plants/new") ? "default" : "ghost"} 
                  size="sm" 
                  className="text-xs md:text-sm"
                >
                  <Plus className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">New Plant</span>
                </Button>
              </Link>
              <Link href="/plants">
                <Button 
                  variant={isActive("/plants") ? "default" : "ghost"} 
                  size="sm" 
                  className="text-xs md:text-sm"
                >
                  <span>My Plants</span>
                </Button>
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center ml-auto gap-2">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => signOut()}
                variant="ghost" 
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/auth/signin" passHref>
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}