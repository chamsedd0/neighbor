import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  propertyId?: string; // Optional reference to a property
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MessageState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: (userId: string) => Promise<void>;
  fetchMessages: (conversationId: string) => void; // Uses onSnapshot for real-time updates
  createConversation: (participants: string[], propertyId?: string) => Promise<string>;
  sendMessage: (conversationId: string, senderId: string, receiverId: string, content: string) => Promise<void>;
  markMessagesAsRead: (conversationId: string, userId: string) => Promise<void>;
  clearError: () => void;
  cleanup: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => {
  let messagesUnsubscribe: () => void = () => {};
  
  return {
    conversations: [],
    selectedConversation: null,
    messages: [],
    isLoading: false,
    error: null,

    fetchConversations: async (userId: string) => {
      try {
        set({ isLoading: true, error: null });
        
        const conversationsQuery = query(
          collection(db, 'conversations'),
          where('participants', 'array-contains', userId),
          orderBy('updatedAt', 'desc')
        );

        const querySnapshot = await getDocs(conversationsQuery);
        
        const conversations = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            lastMessage: data.lastMessage ? {
              ...data.lastMessage,
              createdAt: data.lastMessage.createdAt?.toDate()
            } : undefined,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          } as Conversation;
        });

        set({ conversations, isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    fetchMessages: (conversationId: string) => {
      set({ isLoading: true, error: null, messages: [] });
      
      try {
        // Clean up previous listener if exists
        if (messagesUnsubscribe) {
          messagesUnsubscribe();
        }
        
        const messagesQuery = query(
          collection(db, 'messages'),
          where('conversationId', '==', conversationId),
          orderBy('createdAt', 'asc')
        );

        // Setup real-time listener
        messagesUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate()
            } as Message;
          });

          set({ messages, isLoading: false });
        }, (error: any) => {
          set({ error: error.message, isLoading: false });
        });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    createConversation: async (participants, propertyId) => {
      try {
        set({ isLoading: true, error: null });
        
        // Check if conversation already exists
        const existingConversationsQuery = query(
          collection(db, 'conversations'),
          where('participants', '==', participants.sort())
        );
        
        const existingSnapshot = await getDocs(existingConversationsQuery);
        
        if (!existingSnapshot.empty) {
          set({ isLoading: false });
          return existingSnapshot.docs[0].id;
        }
        
        // Create new conversation
        const conversationData = {
          participants,
          propertyId,
          unreadCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const docRef = await addDoc(collection(db, 'conversations'), conversationData);
        
        // Refresh conversations list
        await get().fetchConversations(participants[0]);
        
        set({ isLoading: false });
        return docRef.id;
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    sendMessage: async (conversationId, senderId, receiverId, content) => {
      try {
        set({ isLoading: true, error: null });
        
        const messageData = {
          conversationId,
          senderId,
          receiverId,
          content,
          read: false,
          createdAt: Timestamp.now()
        };

        // Add message to database
        const messageRef = await addDoc(collection(db, 'messages'), messageData);
        
        // Update conversation with last message
        const conversationRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationRef, {
          lastMessage: {
            id: messageRef.id,
            content,
            senderId,
            createdAt: Timestamp.now()
          },
          updatedAt: Timestamp.now(),
          unreadCount: get().selectedConversation?.unreadCount ? get().selectedConversation.unreadCount + 1 : 1
        });
        
        set({ isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    markMessagesAsRead: async (conversationId, userId) => {
      try {
        set({ isLoading: true, error: null });
        
        // Query for unread messages in this conversation sent to this user
        const messagesQuery = query(
          collection(db, 'messages'),
          where('conversationId', '==', conversationId),
          where('receiverId', '==', userId),
          where('read', '==', false)
        );
        
        const querySnapshot = await getDocs(messagesQuery);
        
        // Update each message to mark as read
        const updatePromises = querySnapshot.docs.map(docSnap => {
          const messageRef = doc(db, 'messages', docSnap.id);
          return updateDoc(messageRef, { read: true });
        });
        
        await Promise.all(updatePromises);
        
        // Reset unread count for conversation
        const conversationRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationRef, { unreadCount: 0 });
        
        // Update the selected conversation in state
        if (get().selectedConversation?.id === conversationId) {
          const updatedConversation = {
            ...get().selectedConversation,
            unreadCount: 0
          };
          set({ selectedConversation: updatedConversation });
        }
        
        set({ isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    clearError: () => {
      set({ error: null });
    },
    
    cleanup: () => {
      if (messagesUnsubscribe) {
        messagesUnsubscribe();
      }
    }
  };
}); 