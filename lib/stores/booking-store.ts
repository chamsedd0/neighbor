import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

export type BookingStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'cancelled'
  | 'completed';

export interface Booking {
  id: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: BookingStatus;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingState {
  bookings: Booking[];
  tenantBookings: Booking[];
  ownerBookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  fetchTenantBookings: (tenantId: string) => Promise<void>;
  fetchOwnerBookings: (ownerId: string) => Promise<void>;
  fetchPropertyBookings: (propertyId: string) => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  tenantBookings: [],
  ownerBookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const bookingsQuery = query(
        collection(db, 'bookings'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(bookingsQuery);
      
      const bookings = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Booking;
      });

      set({ bookings, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTenantBookings: async (tenantId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(bookingsQuery);
      
      const tenantBookings = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Booking;
      });

      set({ tenantBookings, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOwnerBookings: async (ownerId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('ownerId', '==', ownerId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(bookingsQuery);
      
      const ownerBookings = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Booking;
      });

      set({ ownerBookings, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPropertyBookings: async (propertyId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(bookingsQuery);
      
      const bookings = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Booking;
      });

      set({ bookings, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchBookingById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const bookingDoc = await getDoc(doc(db, 'bookings', id));
      
      if (!bookingDoc.exists()) {
        throw new Error('Booking not found');
      }

      const data = bookingDoc.data();
      const booking: Booking = {
        id: bookingDoc.id,
        ...data,
        startDate: data.startDate?.toDate(),
        endDate: data.endDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Booking;

      set({ selectedBooking: booking, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createBooking: async (booking) => {
    try {
      set({ isLoading: true, error: null });
      
      const bookingData = {
        ...booking,
        status: 'pending' as BookingStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      
      // Refresh the bookings list
      await get().fetchBookings();
      
      set({ isLoading: false });
      return docRef.id;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      set({ isLoading: true, error: null });
      
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, {
        status,
        updatedAt: new Date()
      });
      
      // Refresh the booking
      if (get().selectedBooking?.id === id) {
        await get().fetchBookingById(id);
      }
      
      // Refresh the bookings lists
      await get().fetchBookings();
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteBooking: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const bookingRef = doc(db, 'bookings', id);
      await deleteDoc(bookingRef);
      
      // Refresh the bookings list
      await get().fetchBookings();
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  }
})); 