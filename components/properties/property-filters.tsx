"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PropertyFilters } from "@/lib/stores/property-store";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, SlidersHorizontal, X, Home as HomeIcon, DollarSign, Bed, Bath, MapPin, CheckCircle2 } from "lucide-react";

interface PropertyFilterProps {
  onFilterChange: (filters: PropertyFilters) => void;
}

export function PropertyFilters({ onFilterChange }: PropertyFilterProps) {
  const [location, setLocation] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [propertyType, setPropertyType] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);

  const handleApplyFilters = () => {
    onFilterChange({
      location: location || undefined,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < 10000 ? maxPrice : undefined,
      bedrooms: bedrooms > 0 ? bedrooms : undefined,
      bathrooms: bathrooms > 0 ? bathrooms : undefined,
      propertyType: propertyType || undefined,
    });
  };

  const handleResetFilters = () => {
    setLocation("");
    setMinPrice(0);
    setMaxPrice(10000);
    setBedrooms(0);
    setBathrooms(0);
    setPropertyType("");
    
    onFilterChange({});
  };

  // Count how many filters are applied
  const activeFilterCount = [
    !!location,
    minPrice > 0,
    maxPrice < 10000,
    bedrooms > 0,
    bathrooms > 0,
    !!propertyType
  ].filter(Boolean).length;

  return (
    <Card className="border-border/50 rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {/* Location search box */}
      <CardContent className="space-y-5 pt-4">
        <div className="space-y-2">
          <Label className="flex items-center text-sm font-medium">
            <MapPin className="h-4 w-4 mr-1.5 text-primary" />
            Location
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="City, state, or zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9 py-5 rounded-full border-border/70 focus:border-primary"
            />
          </div>
        </div>

        {/* Expandable filters */}
        {isExpanded && (
          <>
            <div className="space-y-3">
              <Label className="flex items-center text-sm font-medium">
                <DollarSign className="h-4 w-4 mr-1.5 text-primary" />
                Price Range
              </Label>
              <div className="flex justify-between text-sm">
                <span className="font-medium">${minPrice.toLocaleString()}</span>
                <span className="font-medium">${maxPrice.toLocaleString()}</span>
              </div>
              <Slider
                defaultValue={[minPrice, maxPrice]}
                min={0}
                max={10000}
                step={100}
                onValueChange={(values) => {
                  setMinPrice(values[0]);
                  setMaxPrice(values[1]);
                }}
                className="py-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="flex items-center text-sm font-medium">
                  <Bed className="h-4 w-4 mr-1.5 text-primary" />
                  Bedrooms
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 0, label: "Any" },
                    { value: 1, label: "1+" },
                    { value: 2, label: "2+" },
                    { value: 3, label: "3+" },
                    { value: 4, label: "4+" },
                    { value: 5, label: "5+" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`py-2 px-1 rounded-md text-sm transition-colors ${
                        bedrooms === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 hover:bg-muted text-foreground"
                      }`}
                      onClick={() => setBedrooms(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="flex items-center text-sm font-medium">
                  <Bath className="h-4 w-4 mr-1.5 text-primary" />
                  Bathrooms
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 0, label: "Any" },
                    { value: 1, label: "1+" },
                    { value: 2, label: "2+" },
                    { value: 3, label: "3+" },
                    { value: 4, label: "4+" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`py-2 px-1 rounded-md text-sm transition-colors ${
                        bathrooms === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 hover:bg-muted text-foreground"
                      }`}
                      onClick={() => setBathrooms(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="propertyType" className="flex items-center text-sm font-medium">
                <HomeIcon className="h-4 w-4 mr-1.5 text-primary" />
                Property Type
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { value: "", label: "Any" },
                  { value: "apartment", label: "Apartment" },
                  { value: "house", label: "House" },
                  { value: "condo", label: "Condo" },
                  { value: "townhouse", label: "Townhouse" },
                  { value: "studio", label: "Studio" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`py-2 px-2 rounded-md text-sm transition-colors flex items-center justify-center ${
                      propertyType === option.value
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "bg-muted/50 hover:bg-muted text-foreground border border-transparent"
                    }`}
                    onClick={() => setPropertyType(option.value)}
                  >
                    {propertyType === option.value && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex gap-3 border-t border-border/50 p-4">
        <Button 
          variant="outline" 
          onClick={handleResetFilters}
          className="flex-1"
          disabled={activeFilterCount === 0}
        >
          Reset All
        </Button>
        <Button 
          onClick={handleApplyFilters}
          className="flex-1"
        >
          Apply Filters
        </Button>
      </CardFooter>
    </Card>
  );
} 