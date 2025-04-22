import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from "@/components/ui/use-toast";

export type UserRole = 'admin' | 'owner' | 'tenant';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: Date;
  photoURL?: string | null;
}

interface AuthState {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, role: UserRole, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userData: null,
  isLoading: true,
  error: null,

  signUp: async (email, password, role, displayName) => {
    try {
      set({ isLoading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: role,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      set({ user, userData, isLoading: false });
      toast({
        variant: "success",
        title: "Account created",
        description: "Your account has been created successfully",
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data() as UserData;

      set({ user, userData, isLoading: false });
      toast({
        variant: "success",
        title: "Welcome back",
        description: "You have been logged in successfully",
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    }
  },

  signInWithGoogle: async (defaultRole = 'tenant') => {
    try {
      set({ isLoading: true, error: null });
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document if first time signing in
        const userData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: defaultRole,
          createdAt: new Date(),
        };

        await setDoc(doc(db, 'users', user.uid), userData);
        set({ user, userData, isLoading: false });
        toast({
          variant: "success",
          title: "Account created",
          description: "Your account has been created successfully with Google",
        });
      } else {
        // User already exists
        const userData = userDoc.data() as UserData;
        set({ user, userData, isLoading: false });
        toast({
          variant: "success",
          title: "Welcome back",
          description: "You have been logged in successfully with Google",
        });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: error.message,
      });
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, userData: null });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      set({ error: error.message });
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

// Setup auth listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        useAuthStore.setState({ user, userData, isLoading: false });
      } else {
        // This handles edge cases where a user might exist in Firebase Auth but not in Firestore
        useAuthStore.setState({ user, isLoading: false });
      }
    } catch (error) {
      useAuthStore.setState({ user, isLoading: false });
    }
  } else {
    useAuthStore.setState({ user: null, userData: null, isLoading: false });
  }
}); 