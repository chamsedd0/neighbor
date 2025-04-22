"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Home, MapPin, Calendar, User, DollarSign, SquareCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { usePropertyStore } from "@/lib/stores/property-store";
import { formatDate, getLocationString, getParamValue } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useMessageStore } from "@/lib/stores/message-store";
import { useRouter } from "next/navigation";

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  // Use our helper to safely get the id parameter
  const unwrappedParams = getParamValue(params);
  const id = unwrappedParams.id;
  
  const { fetchPropertyById, selectedProperty, isLoading, error } = usePropertyStore();
  const { createConversation } = useMessageStore();
  const { isAuthenticated, isTenant } = useAuth();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyById(id);
  }, [fetchPropertyById, id]);

  const handleContactOwner = async () => {
    if (!selectedProperty) return;
    
    if (!isAuthenticated) {
      router.push(`/login?redirect=/properties/${id}`);
      return;
    }

    try {
      // Create a conversation with the property owner
      const conversationId = await createConversation(
        [selectedProperty.ownerId], // Add current user ID automatically in the store
        selectedProperty.id
      );
      
      // Navigate to the messages page with the conversation
      router.push(`/dashboard/messages?conversation=${conversationId}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 sm:px-8 flex justify-center">
        <div className="animate-spin h-8 w-8 text-primary">
          <Home />
        </div>
      </div>
    );
  }

  if (error || !selectedProperty) {
    return (
      <div className="container mx-auto px-4 py-16 sm:px-8">
        <div className="bg-destructive/10 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Property</h2>
          <p className="mb-4">{error || "Property not found"}</p>
          <Button asChild>
            <Link href="/properties">Back to Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  const featuredImage = selectedProperty.images.find(img => img.isFeatured) || selectedProperty.images[0];
  const currentImageUrl = selectedImage || (featuredImage?.url || "");

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8">
      <div className="mb-6">
        <Link href="/properties" className="text-primary mb-4 inline-block">
          &larr; Back to Properties
        </Link>
        <h1 className="text-3xl font-bold mb-2">{selectedProperty.title}</h1>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{getLocationString(selectedProperty.location)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            {currentImageUrl ? (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                <Image
                  src={currentImageUrl}
                  alt={selectedProperty.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                <Home className="h-16 w-16 text-muted-foreground/50" />
              </div>
            )}

            {selectedProperty.images.length > 1 && (
              <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
                {selectedProperty.images.map((image) => (
                  <div
                    key={image.id}
                    className={`relative h-20 w-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${
                      image.url === currentImageUrl ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <Image
                      src={image.url}
                      alt={selectedProperty.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="p-4 border rounded-md mt-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedProperty.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                    <Bed className="h-5 w-5 text-primary mb-1" />
                    <span className="text-sm font-medium">{selectedProperty.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                    <Bath className="h-5 w-5 text-primary mb-1" />
                    <span className="text-sm font-medium">{selectedProperty.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                    <DollarSign className="h-5 w-5 text-primary mb-1" />
                    <span className="text-sm font-medium">${selectedProperty.price}/{selectedProperty.priceUnit}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                    <Home className="h-5 w-5 text-primary mb-1" />
                    <span className="text-sm font-medium">{selectedProperty.squareFeet} sq ft</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="p-4 border rounded-md mt-2">
              <h3 className="text-lg font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedProperty.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center">
                    <SquareCheck className="h-4 w-4 text-primary mr-2" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="location" className="p-4 border rounded-md mt-2">
              <h3 className="text-lg font-semibold mb-2">Location Details</h3>
              <p className="mb-4">
                {selectedProperty.location.address}, {selectedProperty.location.city},{" "}
                {selectedProperty.location.state} {selectedProperty.location.zipCode},{" "}
                {selectedProperty.location.country}
              </p>
              <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Map would be displayed here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">${selectedProperty.price}/{selectedProperty.priceUnit}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">
                    {selectedProperty.availability.isAvailable
                      ? `Available from ${formatDate(selectedProperty.availability.availableFrom || new Date())}`
                      : "Currently unavailable"}
                  </span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Property Owner ID: {selectedProperty.ownerId}</span>
                </div>
              </div>

              {isTenant && (
                <div className="pt-2 space-y-4">
                  <Button className="w-full" onClick={handleContactOwner}>
                    Contact Owner
                  </Button>
                  
                  {isAuthenticated && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/properties/${id}/book`}>
                        Book Now
                      </Link>
                    </Button>
                  )}
                </div>
              )}

              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Check Availability</h3>
                <CalendarComponent
                  mode="single"
                  selected={new Date()}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 