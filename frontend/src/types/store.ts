import type { Conversation, Message } from "@/types/chat";
import type { Friend, FriendRequest, User } from "@/types/user";
import type { Socket } from "socket.io-client";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  clearState: () => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  signUp: (
    userName: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  fetchMe: () => Promise<void>;
  signIn: (userName: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean;
      nextCursor?: string | null;
    }
  >;
  activeConversationId: string | null;
  loading: boolean;
  messageLoading: boolean;
  reset: () => void;

  setActiveConversation: (id: string | null) => void;
  fetchConversations: () => void;
  fetchMessages: (conversationId?: string) => Promise<void>;
  sendDirectMessage: (
    receiverId: string,
    content: string,
    imgUrl?: string,
  ) => Promise<void>;
  sendGroupMessage: (
    conversationId: string,
    content: string,
    imgUrl?: string,
  ) => Promise<void>;
  addMessage: (message: Message) => Promise<void>;
  updateConversation: (conversation: any) => void;
  markAsSeen: () => Promise<void>;
  addConversation: (conversation: Conversation) => void;
  createConversation: (
    type: "direct" | "group",
    name: string,
    memberIds: string[],
  ) => Promise<void>;
  leaveGroup: (conversationId: string) => Promise<void>;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface friendState {
  loading: boolean;
  friends: Friend[];
  receivedList: FriendRequest[];
  sentList: FriendRequest[];
  searchByUserName: (userName: string) => Promise<User | null>;
  addFriend: (receiverId: string, message?: string) => Promise<string>;
  getAllFriendRequests: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
  unFriend: (friendId: string) => Promise<void>;
  getAllFriends: () => Promise<void>;
  addReceivedRequest: (request: FriendRequest) => void;
  addSentRequest: (request: FriendRequest) => void;
  removeSentRequest: (requestId: string) => void;
  removeReceivedRequest: (requestId: string) => void;
}

export interface UserState {
  updateAvatarUrl: (formData: FormData) => Promise<void>;
  updateProfile: (
    userName: string,
    displayName: string,
    email: string,
    phone?: string,
    bio?: string,
  ) => Promise<void>;
}
