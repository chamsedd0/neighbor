"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePropertyStore } from "@/lib/stores/property-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Plus, Trash, UploadCloud } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  propertyType: z.string().min(1, "Property type is required"),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  squareFeet: z.coerce.number().min(1, "Square footage is required"),
  price: z.coerce.number().min(1, "Price is required"),
  priceUnit: z.enum(["month", "week", "day"]),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  ownerId: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

const amenitiesList = [
  { id: "1", name: "Wi-Fi" },
  { id: "2", name: "Air Conditioning" },
  { id: "3", name: "Heating" },
  { id: "4", name: "Washer/Dryer" },
  { id: "5", name: "Dishwasher" },
  { id: "6", name: "Parking" },
  { id: "7", name: "Pool" },
  { id: "8", name: "Gym" },
  { id: "9", name: "Furnished" },
  { id: "10", name: "Pet Friendly" },
  { id: "11", name: "Balcony" },
  { id: "12", name: "Security System" },
];

export default function AddPropertyPage() {
  const { createProperty, uploadPropertyImage, isLoading } = usePropertyStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "",
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 0,
      price: 0,
      priceUnit: "month",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
    if (!featuredImageId && newImages.length > 0) {
      setFeaturedImageId(newImages[0].id);
    }
  };

  const removeImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    if (featuredImageId === id) {
      setFeaturedImageId(images.length > 1 ? images[0].id : null);
    }
  };

  const setFeaturedImage = (id: string) => {
    setFeaturedImageId(id);
  };

  const toggleAmenity = (amenityName: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityName)
        ? prev.filter((a) => a !== amenityName)
        : [...prev, amenityName]
    );
  };

  const nextTab = () => {
    if (activeTab === "details") {
      const fieldsToValidate = ["title", "description", "propertyType", "price", "priceUnit"];
      const isValid = fieldsToValidate.every((field) => {
        const result = form.trigger(field as keyof PropertyFormValues);
        return result;
      });

      if (isValid) setActiveTab("specifications");
    } else if (activeTab === "specifications") {
      const fieldsToValidate = ["bedrooms", "bathrooms", "squareFeet"];
      const isValid = fieldsToValidate.every((field) => {
        const result = form.trigger(field as keyof PropertyFormValues);
        return result;
      });

      if (isValid) setActiveTab("location");
    } else if (activeTab === "location") {
      const fieldsToValidate = ["address", "city", "state", "zipCode", "country"];
      const isValid = fieldsToValidate.every((field) => {
        const result = form.trigger(field as keyof PropertyFormValues);
        return result;
      });

      if (isValid) setActiveTab("amenities");
    } else if (activeTab === "amenities") {
      setActiveTab("images");
    }
  };

  const prevTab = () => {
    if (activeTab === "specifications") setActiveTab("details");
    else if (activeTab === "location") setActiveTab("specifications");
    else if (activeTab === "amenities") setActiveTab("location");
    else if (activeTab === "images") setActiveTab("amenities");
  };

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      toast({
        title: "Creating property...",
        description: "Please wait while we process your submission.",
      });

      // Convert amenities to the format expected by the API
      const formattedAmenities = selectedAmenities.map((name, index) => ({
        id: index.toString(),
        name,
      }));

      // Create the property with all required fields
      // Use "as any" to bypass TypeScript's type checking for now
      const propertyData = {
        ownerId: "user-id", // This will be replaced in the store with Firebase Auth user.uid
        title: data.title,
        description: data.description,
        price: data.price,
        priceUnit: data.priceUnit,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        squareFeet: data.squareFeet,
        propertyType: data.propertyType,
        amenities: formattedAmenities,
        images: [],
        availability: {
          isAvailable: true,
          availableFrom: new Date(),
        },
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        }
      } as any;

      // Create the property in Firestore
      const propertyId = await createProperty(propertyData);

      // If we have images, upload them to Firebase Storage
      if (images.length > 0 && propertyId) {
        toast({
          title: "Uploading images...",
          description: `Uploading ${images.length} images to your property.`,
        });
        
        // Upload images sequentially
        for (const img of images) {
          try {
            const isFeatured = img.id === featuredImageId;
            await uploadPropertyImage(propertyId, img.file, isFeatured);
          } catch (err) {
            console.error('Failed to upload image:', err);
          }
        }
      }

      toast({
        title: "Success!",
        description: "Your property has been successfully created and listed.",
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/properties");
      }, 1500);
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to create property. Please try again later."
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
          <p className="text-muted-foreground">
            Fill in the details to list a new property
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/properties")}
        >
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter property title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the property" 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                              <SelectItem value="studio">Studio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="priceUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Per</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="month">Month</SelectItem>
                                <SelectItem value="week">Week</SelectItem>
                                <SelectItem value="day">Day</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="specifications" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="squareFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Square Feet</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Zip Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenitiesList.map((amenity) => (
                      <div
                        key={amenity.id}
                        className={`flex items-center space-x-2 border p-3 rounded-md cursor-pointer ${
                          selectedAmenities.includes(amenity.name)
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                        onClick={() => toggleAmenity(amenity.name)}
                      >
                        <div className="flex-shrink-0">
                          {selectedAmenities.includes(amenity.name) ? (
                            <Check className="h-5 w-5 text-primary" />
                          ) : (
                            <Plus className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4 pt-4">
                  <div className="border border-dashed rounded-lg p-6 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4 mb-4">
                      <h3 className="text-lg font-semibold">Upload Images</h3>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop images or click to browse
                      </p>
                    </div>
                    <Input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      Select Images
                    </Button>
                  </div>

                  {images.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">
                        Uploaded Images ({images.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((img) => (
                          <div
                            key={img.id}
                            className={`relative group rounded-md overflow-hidden border ${
                              featuredImageId === img.id 
                                ? "ring-2 ring-primary" 
                                : ""
                            }`}
                          >
                            <img
                              src={img.preview}
                              alt="Property"
                              className="h-40 w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant={featuredImageId === img.id ? "default" : "outline"}
                                onClick={() => setFeaturedImage(img.id)}
                                className="bg-background/90 hover:bg-background/100"
                              >
                                {featuredImageId === img.id 
                                  ? "Featured Image" 
                                  : "Set as Featured"
                                }
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removeImage(img.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                            {featuredImageId === img.id && (
                              <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                                Featured
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevTab}
                  disabled={activeTab === "details"}
                >
                  Previous
                </Button>
                {activeTab === "images" ? (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Create Property"}
                  </Button>
                ) : (
                  <Button type="button" onClick={nextTab}>
                    Next
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 