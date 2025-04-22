"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Users, MessageSquare, CalendarClock } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { isAdmin, isOwner, isTenant } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your Neighbor dashboard</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isOwner && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="h-5 w-5 text-primary" />
                Properties
              </CardTitle>
              <CardDescription>Manage your rental properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href="/dashboard/properties">View My Properties</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/add-property">Add New Property</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {isTenant && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarClock className="h-5 w-5 text-primary" />
                Bookings
              </CardTitle>
              <CardDescription>View and manage your bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href="/dashboard/bookings">View My Bookings</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/properties">Find New Properties</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              Messages
            </CardTitle>
            <CardDescription>Communicate with {isOwner ? 'tenants' : 'property owners'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>
        
        {isAdmin && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>Manage users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/profile">
                <span>Update Profile</span>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/settings">
                <span>Account Settings</span>
              </Link>
            </Button>
            {isOwner && (
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/add-property">
                  <span>List a New Property</span>
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity to display.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 