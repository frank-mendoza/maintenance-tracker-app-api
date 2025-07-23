import { User } from "@/types/user.type";
import { create } from "zustand";

interface GlobalStoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  loading: boolean;
  loadingSpiner: boolean;
  setLoadingSpinner: (state: boolean) => void;
  setLoading: (state: boolean) => void;
}

const useGlobalStore = create<GlobalStoreState>((set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
  },
  clearUser: () => {
    set({ user: null });
    localStorage.removeItem("user"); // Remove from local storage
  },

  loading: false,
  setLoading: (state) => set({ loading: state }),
  loadingSpiner: false,
  setLoadingSpinner: (state) => set({ loadingSpiner: state }),

  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export default useGlobalStore;
