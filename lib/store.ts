import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole, PickupRequest } from './types';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

export interface UIState {
  isMuted: boolean;
  theaterMode: boolean;
  isNexusGPTOpen: boolean;
  activeLanguage: 'all' | 'hindi' | 'english';
  toggleMute: () => void;
  setTheaterMode: (mode: boolean) => void;
  setNexusGPTOpen: (open: boolean) => void;
  setActiveLanguage: (lang: 'all' | 'hindi' | 'english') => void;
}

export const DEMO_USERS: Record<UserRole, User> = {
  individual: {
    id: 'demo_user_1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@nexus.eco',
    role: 'individual',
    status: 'active',
    phone: '+91 98101 23456',
    address: 'Flat 402, Green Valley Apartments, Sector 62, Noida, Uttar Pradesh',
    createdAt: new Date().toISOString(),
  },
  partner: {
    id: 'demo_partner_1',
    name: 'Apex Clean Logistics (NCR Fleet)',
    email: 'dispatch@apexfleet.in',
    role: 'partner',
    status: 'active',
    phone: '+91 98991 55019',
    address: 'Plot 44, Cyber Logistics Hub, Udyog Vihar Phase IV, Gurugram, Haryana',
    organization: 'Apex Clean Logistics India Pvt Ltd',
    createdAt: new Date().toISOString(),
  },
  recycler: {
    id: 'demo_recycler_1',
    name: 'GreenTerra Hydrometallurgy & Smelter',
    email: 'operations@greenterra.in',
    role: 'recycler',
    status: 'active',
    phone: '+91 98202 88320',
    address: 'E-48, Okhla Industrial Area Phase-III, New Delhi, Delhi 110020',
    organization: 'GreenTerra Hydrometallurgy & Refining Ltd',
    createdAt: new Date().toISOString(),
  },
  admin: {
    id: 'demo_admin_1',
    name: 'Dr. Rameshwar Rao (CPCB Central Auditor)',
    email: 'admin@cpcb.gov.in',
    role: 'admin',
    status: 'active',
    phone: '+91 11 4310 2000',
    address: 'Parivesh Bhawan, East Arjun Nagar, Delhi 110032',
    organization: 'Central Pollution Control Board (CPCB)',
    createdAt: new Date().toISOString(),
  },
};

// Zustand Auth Store with local storage persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, // default strictly unauthenticated: requires login to enter
      token: null,
      isLoading: false,
      setUser: (user, token = null) => {
        const sessionToken = token || (user ? `nexus_jwt_${user.role}_token` : null);
        if (typeof document !== 'undefined' && sessionToken) {
          document.cookie = `nexus_token=${sessionToken}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({ user, token: sessionToken });
      },
      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'nexus_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        set({ user: null, token: null });
      },
      switchDemoRole: (role: UserRole) => {
        const token = `nexus_jwt_${role}_token`;
        if (typeof document !== 'undefined') {
          document.cookie = `nexus_token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({ user: DEMO_USERS[role], token });
      },
    }),
    {
      name: 'nexus-auth-storage-v2',
    }
  )
);

// Zustand UI Store
export const useUIStore = create<UIState>()((set) => ({
  isMuted: false,
  theaterMode: false,
  isNexusGPTOpen: false,
  activeLanguage: 'all',
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setTheaterMode: (mode) => set({ theaterMode: mode }),
  setNexusGPTOpen: (open) => set({ isNexusGPTOpen: open }),
  setActiveLanguage: (lang) => set({ activeLanguage: lang }),
}));
