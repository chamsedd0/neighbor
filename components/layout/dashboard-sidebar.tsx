"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Home,
  CalendarClock,
  MessageSquare,
  User,
  Settings,
  Users,
  LogOut,
  ListPlus,
  TestTube,
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarLink({ href, icon, label, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isAdmin, isOwner, isTenant } = useAuth();
  const { signOut } = useAuthStore();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-background px-4 py-8 fixed">
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Neighbor</span>
        </Link>
      </div>

      <nav className="space-y-1 flex-1">
        <SidebarLink
          href="/dashboard"
          icon={<LayoutDashboard className="h-4 w-4" />}
          label="Dashboard"
          active={isActive("/dashboard")}
        />

        {isOwner && (
          <>
            <SidebarLink
              href="/dashboard/properties"
              icon={<Home className="h-4 w-4" />}
              label="My Properties"
              active={isActive("/dashboard/properties")}
            />
            <SidebarLink
              href="/dashboard/add-property"
              icon={<ListPlus className="h-4 w-4" />}
              label="Add Property"
              active={isActive("/dashboard/add-property")}
            />
          </>
        )}

        {isTenant && (
          <SidebarLink
            href="/dashboard/bookings"
            icon={<CalendarClock className="h-4 w-4" />}
            label="My Bookings"
            active={isActive("/dashboard/bookings")}
          />
        )}

        <SidebarLink
          href="/dashboard/messages"
          icon={<MessageSquare className="h-4 w-4" />}
          label="Messages"
          active={isActive("/dashboard/messages")}
        />

        {isAdmin && (
          <SidebarLink
            href="/admin/users"
            icon={<Users className="h-4 w-4" />}
            label="Manage Users"
            active={isActive("/admin/users")}
          />
        )}

        <SidebarLink
          href="/dashboard/profile"
          icon={<User className="h-4 w-4" />}
          label="Profile"
          active={isActive("/dashboard/profile")}
        />

        <SidebarLink
          href="/dashboard/settings"
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
          active={isActive("/dashboard/settings")}
        />

        <SidebarLink
          href="/toast-test"
          icon={<TestTube className="h-4 w-4" />}
          label="Toast Test"
          active={pathname === "/toast-test"}
        />
      </nav>

      <div className="mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
      </div>
    </aside>
  );
} 