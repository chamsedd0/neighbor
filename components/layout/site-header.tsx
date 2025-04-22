import Link from "next/link";
import Image from "next/image";
import { Home as HomeIcon } from "lucide-react";
import { MainNav } from "@/components/layout/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center px-4 sm:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <HomeIcon className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-primary">Neighbor</span>
          </span>
        </Link>
        <div className="ml-8 flex-1">
          <MainNav />
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 