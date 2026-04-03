import { chatService } from "@/services/chatService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSocketStore } from "@/stores/useSocketStore";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      loading: false,
      messageLoading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),

      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          loading: false,
          messageLoading: false,
        });
      },

      fetchConversations: async () => {
        try {
          set({ loading: true });
          const { conversations } = await chatService.fetchConversations();
          set({ conversations, loading: false });
        } catch (error) {
          console.error(error);
          set({ loading: false });
        }
      },

      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const convoId = conversationId ?? activeConversationId;
        if (!convoId) return;

        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;
        if (nextCursor === null) return;

        set({ messageLoading: true });

        try {
          const { messages: fetched, cursor } = await chatService.fetchMessages(
            convoId,
            nextCursor,
          );
          const processed = fetched.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id,
          }));

          set((state) => {
            const prev = state.messages[convoId]?.items ?? [];
            const merged =
              prev.length > 0 ? [...processed, ...prev] : processed;

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error(error);
        } finally {
          set({ messageLoading: false });
        }
      },

      sendDirectMessage: async (
        receiverId,
        content,
        conversationId,
        imgUrl,
      ) => {
        try {
          conversationId = get().activeConversationId;
          await chatService.sendDirectMessage(
            receiverId,
            content,
            conversationId || undefined,
            imgUrl,
          );

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === conversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error(error);
        }
      },

      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          await chatService.sendGroupMessage(conversationId, content, imgUrl);
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === get().activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error(error);
        }
      },

      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();

          message.isOwn = message.senderId === user?._id;

          const conversationId = message.conversationId;

          let prevItems = get().messages[conversationId]?.items ?? [];

          if (prevItems.length === 0) {
            await fetchMessages(message.conversationId);
            prevItems = get().messages[conversationId]?.items ?? [];
          }

          set((state) => {
            if (prevItems.some((m) => m._id === message._id)) {
              return state;
            }

            return {
              messages: {
                ...state.messages,
                [conversationId]: {
                  items: [...prevItems, message],
                  hasMore: state.messages[conversationId].hasMore,
                  nextCursor:
                    state.messages[conversationId].nextCursor ?? undefined,
                },
              },
            };
          });
        } catch (error) {
          console.error(error);
        }
      },

      updateConversation: (conversation) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === conversation._id ? { ...c, ...conversation } : c,
          ),
        }));
      },

      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) {
            return;
          }

          const conversation = conversations.find(
            (c) => c._id === activeConversationId,
          );

          if (!conversation) return;

          if ((conversation.unreadCounts?.[user._id] ?? 0) === 0) return;

          await chatService.markAsSeen(activeConversationId);

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? {
                    ...c,
                    unreadCounts: {
                      ...c.unreadCounts,
                      [user._id]: 0,
                    },
                  }
                : c,
            ),
          }));
        } catch (error) {
          console.error(error);
        }
      },

      addConversation: (conversation) => {
        set((state) => {
          const exists = state.conversations.some(
            (c) => c._id.toString() === conversation._id.toString(),
          );

          return {
            conversations: exists
              ? state.conversations
              : [conversation, ...state.conversations],
            activeConversationId: conversation._id,
          };
        });
      },

      createConversation: async (type, name, memberIds) => {
        try {
          const conversation = await chatService.createConversation(
            type,
            name,
            memberIds,
          );
          get().addConversation(conversation);

          useSocketStore
            .getState()
            .socket?.emit("join-conversation", conversation._id);

          get().fetchMessages(conversation._id);
        } catch (error) {
          console.error(error);
        }
      },

      leaveGroup: async (conversationId) => {
        try {
          set({ loading: true });
          const conversation = await chatService.leaveGroup(conversationId);
          set((state) => {
            const exists = state.conversations.some(
              (c) => c._id.toString() === conversation._id.toString(),
            );

            return {
              conversations: exists
                ? state.conversations.filter((c) => c._id !== conversation._id)
                : state.conversations,
            };
          });
        } catch (error) {
          console.error(error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ conversations: state.conversations }),
    },
  ),
);
