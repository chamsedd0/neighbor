"use client";

import { useState, useEffect } from "react";
import { usePropertyStore } from "@/lib/stores/property-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Home, ArrowUpDown, Search, X } from "lucide-react";

export default function AvailablePropertiesPage() {
  const { fetchProperties, properties, isLoading } = usePropertyStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"price" | "date" | "size">("date");

  useEffect(() => {
    // Fetch only available properties
    fetchProperties({ status: "available" });
  }, [fetchProperties]);

  // Filter properties based on search criteria
  const filteredProperties = properties.filter((property) => {
    // Search term filter
    const matchesSearchTerm =
      !searchTerm ||
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.state.toLowerCase().includes(searchTerm.toLowerCase());

    // Price range filter
    const matchesPriceRange =
      property.price >= priceRange[0] && property.price <= priceRange[1];

    // Property type filter
    const matchesPropertyType = !propertyType || property.propertyType === propertyType;

    // Bedrooms filter
    const matchesBedrooms = !bedrooms || property.bedrooms >= bedrooms;

    // Bathrooms filter
    const matchesBathrooms = !bathrooms || property.bathrooms >= bathrooms;

    // Amenities filter
    const matchesAmenities =
      amenities.length === 0 ||
      amenities.every((amenity) =>
        property.amenities.some((a) => a.name === amenity)
      );

    return (
      matchesSearchTerm &&
      matchesPriceRange &&
      matchesPropertyType &&
      matchesBedrooms &&
      matchesBathrooms &&
      matchesAmenities
    );
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortBy === "size") {
      return sortOrder === "asc"
        ? a.squareFeet - b.squareFeet
        : b.squareFeet - a.squareFeet;
    } else {
      // Default sort by date
      return sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 5000]);
    setPropertyType(null);
    setBedrooms(null);
    setBathrooms(null);
    setAmenities([]);
  };

  const commonAmenities = [
    "Wi-Fi",
    "Air Conditioning",
    "Heating",
    "Washer/Dryer",
    "Parking",
    "Pool",
    "Gym",
    "Pet Friendly",
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Properties</h1>
        <p className="text-muted-foreground">
          Browse and apply for available rental properties
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter sidebar */}
        <Card className="md:col-span-1 h-fit sticky top-4">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-2.5"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Price Range</Label>
              <div className="pt-2 px-2">
                <Slider
                  defaultValue={[0, 5000]}
                  min={0}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Property Type</Label>
              <Select
                value={propertyType || ""}
                onValueChange={(value) => setPropertyType(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any type</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Bedrooms</Label>
              <Select
                value={bedrooms?.toString() || ""}
                onValueChange={(value) => setBedrooms(value ? parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Bathrooms</Label>
              <Select
                value={bathrooms?.toString() || ""}
                onValueChange={(value) => setBathrooms(value ? parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {commonAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label
                      htmlFor={`amenity-${amenity}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Properties list */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {sortedProperties.length} properties found
            </p>
            <div className="flex items-center space-x-2">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as "price" | "date" | "size")}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Listed</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className={`h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : sortedProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-xl font-medium">No properties found</p>
              <p className="text-muted-foreground">
                Try adjusting your search filters to see more properties
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/dashboard/properties/${property.id}`}
                  className="block"
                >
                  <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={property.images[0]?.url || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-background text-foreground text-sm font-medium px-2 py-1 rounded-full">
                        {formatPrice(property.price)}/{property.priceUnit}
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm line-clamp-1">
                          {property.address}, {property.city}, {property.state}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-1" />
                          <span>{property.squareFeet} sqft</span>
                        </div>
                      </div>
                      <Button className="w-full">View Details</Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 