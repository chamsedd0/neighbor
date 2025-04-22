import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  startAfter,
  limit,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { toast } from "@/components/ui/use-toast";
import { getAuth } from 'firebase/auth';

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PropertyImage {
  id: string;
  url: string;
  isFeatured: boolean;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  priceUnit: 'month' | 'week' | 'day';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string; // apartment, house, condo, etc.
  location: PropertyLocation;
  amenities: Amenity[];
  images: PropertyImage[];
  availability: {
    isAvailable: boolean;
    availableFrom?: Date;
    availableTo?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  amenities?: string[];
}

interface PropertyState {
  properties: Property[];
  userProperties: Property[];
  selectedProperty: Property | null;
  isLoading: boolean;
  error: string | null;
  filters: PropertyFilters;
  lastVisible: DocumentData | null;
  fetchProperties: (limit?: number) => Promise<void>;
  fetchMoreProperties: () => Promise<void>;
  fetchUserProperties: (userId: string) => Promise<void>;
  fetchPropertyById: (id: string) => Promise<void>;
  createProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProperty: (id: string, data: Partial<Omit<Property, 'id'>>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  uploadPropertyImage: (propertyId: string, file: File, isFeatured?: boolean) => Promise<PropertyImage>;
  deletePropertyImage: (propertyId: string, imageId: string) => Promise<void>;
  setFilters: (filters: PropertyFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
  fetchOwnerProperties: () => Promise<void>;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  userProperties: [],
  selectedProperty: null,
  isLoading: false,
  error: null,
  filters: {},
  lastVisible: null,

  fetchProperties: async (pageLimit = 10) => {
    try {
      set({ isLoading: true, error: null });
      const { filters } = get();
      
      let propertiesQuery = query(
        collection(db, 'properties'),
        orderBy('createdAt', 'desc'),
        limit(pageLimit)
      );

      // Apply filters if they exist
      if (filters) {
        if (filters.minPrice) {
          propertiesQuery = query(propertiesQuery, where('price', '>=', filters.minPrice));
        }
        if (filters.maxPrice) {
          propertiesQuery = query(propertiesQuery, where('price', '<=', filters.maxPrice));
        }
        if (filters.bedrooms) {
          propertiesQuery = query(propertiesQuery, where('bedrooms', '>=', filters.bedrooms));
        }
        if (filters.bathrooms) {
          propertiesQuery = query(propertiesQuery, where('bathrooms', '>=', filters.bathrooms));
        }
        if (filters.propertyType) {
          propertiesQuery = query(propertiesQuery, where('propertyType', '==', filters.propertyType));
        }
      }

      const querySnapshot = await getDocs(propertiesQuery);
      
      const properties = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          availability: {
            ...data.availability,
            availableFrom: data.availability?.availableFrom?.toDate(),
            availableTo: data.availability?.availableTo?.toDate(),
          }
        } as Property;
      });

      set({ 
        properties, 
        isLoading: false,
        lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  },

  fetchMoreProperties: async () => {
    try {
      const { lastVisible, properties, filters } = get();
      if (!lastVisible) return;

      set({ isLoading: true, error: null });
      
      let propertiesQuery = query(
        collection(db, 'properties'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(10)
      );

      // Apply filters if they exist
      if (filters) {
        // Same filter logic as in fetchProperties
      }

      const querySnapshot = await getDocs(propertiesQuery);
      
      const newProperties = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          availability: {
            ...data.availability,
            availableFrom: data.availability?.availableFrom?.toDate(),
            availableTo: data.availability?.availableTo?.toDate(),
          }
        } as Property;
      });

      set({ 
        properties: [...properties, ...newProperties], 
        isLoading: false,
        lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  },

  fetchUserProperties: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const propertiesQuery = query(
        collection(db, 'properties'),
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(propertiesQuery);
      
      const userProperties = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          availability: {
            ...data.availability,
            availableFrom: data.availability?.availableFrom?.toDate(),
            availableTo: data.availability?.availableTo?.toDate(),
          }
        } as Property;
      });

      set({ userProperties, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  },

  fetchPropertyById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const propertyDoc = await getDocs(query(collection(db, 'properties'), where('id', '==', id)));
      
      if (propertyDoc.empty) {
        throw new Error('Property not found');
      }

      const data = propertyDoc.docs[0].data();
      const property: Property = {
        id: propertyDoc.docs[0].id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        availability: {
          ...data.availability,
          availableFrom: data.availability?.availableFrom?.toDate(),
          availableTo: data.availability?.availableTo?.toDate(),
        }
      } as Property;

      set({ selectedProperty: property, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  },

  fetchOwnerProperties: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get the current user ID from auth
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("You must be logged in to view your properties");
      }
      
      // Query properties where ownerId matches current user's ID
      const propertiesQuery = query(
        collection(db, 'properties'),
        where('ownerId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(propertiesQuery);
      
      const properties = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          availability: {
            ...data.availability,
            availableFrom: data.availability?.availableFrom?.toDate(),
            availableTo: data.availability?.availableTo?.toDate(),
          }
        } as Property;
      });
      
      set({ properties, isLoading: false });
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch properties";
      set({ error: errorMessage, isLoading: false });
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  },

  createProperty: async (property) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get the current user ID from auth
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error("You must be logged in to create a property");
      }
      
      // Ensure the property has the current user's ID as owner
      const propertyData = {
        ...property,
        ownerId: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add the property to the Firestore 'properties' collection
      const docRef = await addDoc(collection(db, 'properties'), propertyData);
      
      // Refresh the properties list
      await get().fetchOwnerProperties();
      
      set({ isLoading: false });
      toast({
        variant: "success",
        title: "Success",
        description: "Property added successfully",
      });
      
      return docRef.id;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
  },

  updateProperty: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      
      const propertyRef = doc(db, 'properties', id);
      await updateDoc(propertyRef, {
        ...data,
        updatedAt: new Date()
      });
      
      // Refresh the properties list
      await get().fetchProperties();
      
      set({ isLoading: false });
      toast({
        variant: "success",
        title: "Success",
        description: "Property updated successfully",
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  },

  deleteProperty: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const propertyRef = doc(db, 'properties', id);
      await deleteDoc(propertyRef);
      
      // Refresh the properties list
      await get().fetchProperties();
      
      set({ isLoading: false });
      toast({
        variant: "success",
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  },

  uploadPropertyImage: async (propertyId, file, isFeatured = false) => {
    try {
      set({ isLoading: true, error: null });
      
      const imageId = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `properties/${propertyId}/${imageId}`);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      const newImage = {
        id: imageId,
        url,
        isFeatured
      };

      // Update the property with the new image
      const propertyRef = doc(db, 'properties', propertyId);
      const property = get().selectedProperty;
      
      if (property) {
        const updatedImages = [...property.images, newImage];
        await updateDoc(propertyRef, { 
          images: updatedImages,
          updatedAt: new Date()
        });
      }
      
      set({ isLoading: false });
      toast({
        variant: "success",
        title: "Success",
        description: "Property image uploaded successfully",
      });
      return newImage;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
  },

  deletePropertyImage: async (propertyId, imageId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Delete from storage
      const storageRef = ref(storage, `properties/${propertyId}/${imageId}`);
      await deleteObject(storageRef);
      
      // Update property document
      const propertyRef = doc(db, 'properties', propertyId);
      const property = get().selectedProperty;
      
      if (property) {
        const updatedImages = property.images.filter(img => img.id !== imageId);
        await updateDoc(propertyRef, { 
          images: updatedImages,
          updatedAt: new Date()
        });
      }
      
      set({ isLoading: false });
      toast({
        variant: "success",
        title: "Success",
        description: "Property image deleted successfully",
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  },

  setFilters: (filters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearError: () => {
    set({ error: null });
  },
})); 