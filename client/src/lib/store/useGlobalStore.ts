import { create } from "zustand";

interface User {
  name: string;
  lastName: string;
  email: string;
  password: string; // store hashed password
  role: "tenant" | "landlord" | "technician";
  assignedRequests?: string[]; // maintenance IDs (for technicians)
  propertiesOwned?: string[]; // property IDs (for landlords)
  createdAt: Date;
}

interface GlobalStoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  loading: boolean;
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
  // setTimeout(() => {

  // }, 1000),

  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export default useGlobalStore;
