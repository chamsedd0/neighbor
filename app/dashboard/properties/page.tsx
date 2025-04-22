"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/properties/property-card";
import { usePropertyStore } from "@/lib/stores/property-store";
import { Loader2, Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PropertiesPage() {
  const { properties, fetchOwnerProperties, isLoading } = usePropertyStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priceAsc" | "priceDesc">("newest");

  useEffect(() => {
    fetchOwnerProperties();
  }, [fetchOwnerProperties]);

  const filteredProperties = properties
    .filter(property => 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.state.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-muted-foreground">Manage your rental properties</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/add-property" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Property</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Properties Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{properties.length}</div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{properties.filter(p => p.status === 'available').length}</div>
                <p className="text-sm text-muted-foreground">Available</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{properties.filter(p => p.status === 'rented').length}</div>
                <p className="text-sm text-muted-foreground">Rented</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search properties..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center p-12 border rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? "No properties match your search criteria. Try a different search term." 
              : "You haven't listed any properties yet."}
          </p>
          <Button asChild>
            <Link href="/dashboard/add-property">Add Your First Property</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              showViewButton={false}
              showContactButton={false}
            >
              <div className="flex items-center justify-between mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/properties/${property.id}`}>Manage</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/properties/${property.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </PropertyCard>
          ))}
        </div>
      )}
    </div>
  );
} 