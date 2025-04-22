"use client";

import { useEffect, useState } from "react";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyFilters } from "@/components/properties/property-filters";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Search, ArrowUpDown, Grid, List } from "lucide-react";
import { usePropertyStore, PropertyFilters as FilterType } from "@/lib/stores/property-store";

export default function PropertiesPage() {
  const { properties, isLoading, error, fetchProperties, fetchMoreProperties, setFilters, clearFilters } = usePropertyStore();
  const [appliedFilters, setAppliedFilters] = useState<FilterType>({});
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (filters: FilterType) => {
    setAppliedFilters(filters);
    setFilters(filters);
    fetchProperties();
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-3">Find Your <span className="text-primary">Perfect Home</span></h1>
        <p className="text-lg text-muted-foreground">
          Browse our curated selection of long-term rental properties in your desired location
        </p>
      </div>

      {/* Search bar for mobile */}
      <div className="mb-8 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by location..." 
            className="w-full pl-10 pr-4 py-3 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 hidden md:block">
          <div className="sticky top-24">
            <PropertyFilters onFilterChange={handleFilterChange} />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-muted/40 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <span className="font-medium">
                {Object.keys(appliedFilters).length > 0 ? (
                  `${properties.length} properties with filters`
                ) : (
                  'All properties'
                )}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => {/* Sorting logic */}}
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort</span>
              </Button>
              <div className="border-r h-8 border-border/70"></div>
              <div className="flex rounded-md border border-border overflow-hidden">
                <button 
                  className={`p-2 ${isGridView ? 'bg-primary text-primary-foreground' : 'bg-card'}`}
                  onClick={() => setIsGridView(true)}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button 
                  className={`p-2 ${!isGridView ? 'bg-primary text-primary-foreground' : 'bg-card'}`}
                  onClick={() => setIsGridView(false)}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {isLoading && properties.length === 0 ? (
            <div className="flex justify-center items-center h-64 bg-muted/30 rounded-xl">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Searching for properties...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 p-8 rounded-xl text-center">
              <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Properties</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  clearFilters();
                  fetchProperties();
                }}
              >
                Try Again
              </Button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center p-12 border rounded-xl bg-muted/10">
              <h3 className="text-xl font-semibold mb-3">No properties found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any properties matching your criteria. Try adjusting your filters or search for a different location.
              </p>
              <Button 
                className="rounded-full"
                onClick={() => {
                  clearFilters();
                  setAppliedFilters({});
                  fetchProperties();
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    showViewButton
                    showContactButton={false}
                  />
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8"
                  onClick={() => fetchMoreProperties()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    "Show More Properties"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 