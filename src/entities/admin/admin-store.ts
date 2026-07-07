import { create } from 'zustand';

type AdminStatus = 'loading' | 'admin' | 'not_admin';

interface AdminState {
  status: AdminStatus;
  setStatus: (status: AdminStatus) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  status: 'loading',
  setStatus: (status) => set({ status }),
}));
