"use client";

import { Property } from "@/lib/stores/property-store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Home as HomeIcon, MapPin, Star, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getLocationString } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  showViewButton?: boolean;
  showContactButton?: boolean;
}

export function PropertyCard({ 
  property, 
  showViewButton = true,
  showContactButton = false,
}: PropertyCardProps) {
  const { id, title, price, priceUnit, bedrooms, bathrooms, location, images } = property;
  
  // Get the featured image or the first image
  const featuredImage = images.find(img => img.isFeatured) || images[0];
  
  return (
    <Card className="overflow-hidden h-full flex flex-col border border-border/50 rounded-xl hover:shadow-md transition-all duration-200 group">
      <div className="relative aspect-[4/3] overflow-hidden">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <HomeIcon className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-colors">
          <Heart className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
        </button>
        <div className="absolute bottom-3 left-3 bg-background/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
          <Star className="h-4 w-4 text-primary fill-primary mr-1" />
          <span className="text-sm font-medium">{(Math.random() * (5 - 4.5) + 4.5).toFixed(1)}</span>
          <span className="text-xs text-muted-foreground ml-1">({Math.floor(Math.random() * 50) + 10})</span>
        </div>
      </div>
      
      <CardContent className="flex-1 p-6">
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{getLocationString(location)}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Bed className="h-4 w-4 mr-1" />
            <span>{bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Bath className="h-4 w-4 mr-1" />
            <span>{bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}</span>
          </div>
        </div>
        
        <p className="font-semibold text-lg mt-auto">
          ${price}
          <span className="text-muted-foreground text-sm font-normal">/{priceUnit}</span>
        </p>
      </CardContent>
      
      {(showViewButton || showContactButton) && (
        <CardFooter className="p-6 pt-0 gap-3">
          {showViewButton && (
            <Button variant="outline" className="w-full rounded-full" asChild>
              <Link href={`/properties/${id}`}>View Details</Link>
            </Button>
          )}
          
          {showContactButton && (
            <Button className="w-full rounded-full" asChild>
              <Link href={`/properties/${id}/contact`}>Contact Owner</Link>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
} 