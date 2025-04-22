"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/stores/auth-store";

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isOwner, isTenant } = useAuth();
  const { signOut } = useAuthStore();

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/properties",
      label: "Properties",
      active: pathname === "/properties",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
    {
      href: "/contact",
      label: "Contact",
      active: pathname === "/contact",
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}

      <div className="ml-auto flex items-center space-x-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">My Account</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              
              {isOwner && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/properties">My Properties</Link>
                </DropdownMenuItem>
              )}

              {isTenant && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/bookings">My Bookings</Link>
                </DropdownMenuItem>
              )}

              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem asChild>
                <Link href="/dashboard/messages">Messages</Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button variant="default" asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
} 