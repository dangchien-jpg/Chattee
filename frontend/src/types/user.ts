export interface User {
  _id: string;
  userName: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Friend {
  _id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface FriendRequest {
  receiverId: {
    _id: string;
    userName: string;
    displayName: string;
    avatarUrl?: string;
  };
  senderId: {
    _id: string;
    userName: string;
    displayName: string;
    avatarUrl?: string;
  };
  _id: string;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
}
