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
    name: 'Alex Mercer',
    email: 'alex.mercer@gmail.com',
    role: 'individual',
    status: 'active',
    phone: '+1 (415) 890-2134',
    address: '742 Evergreen Terrace, Sector 4, Silicon Valley, CA',
    createdAt: new Date().toISOString(),
  },
  partner: {
    id: 'demo_partner_1',
    name: 'Apex Green Fleet (Logistics)',
    email: 'dispatch@apexfleet.com',
    role: 'partner',
    status: 'active',
    phone: '+1 (510) 555-0192',
    address: '88 Circular Freight Terminal, Oakland, CA',
    organization: 'Apex Green Fleet Logistics Corp',
    createdAt: new Date().toISOString(),
  },
  recycler: {
    id: 'demo_recycler_1',
    name: 'EcoRefine Hydrometallurgy',
    email: 'operations@ecorefine.org',
    role: 'recycler',
    status: 'active',
    phone: '+1 (408) 555-8832',
    address: '14 Industrial Smelter Pkwy, San Jose, CA',
    organization: 'EcoRefine Smelting & Hydrometallurgy Ltd',
    createdAt: new Date().toISOString(),
  },
  admin: {
    id: 'demo_admin_1',
    name: 'Dr. Elena Vance (Auditor)',
    email: 'admin@ewastenexus.gov',
    role: 'admin',
    status: 'active',
    phone: '+1 (202) 555-0177',
    address: 'Federal EPA CleanTech Corridor, Washington, DC',
    organization: 'Central EPR Governance Authority',
    createdAt: new Date().toISOString(),
  },
};

// Zustand Auth Store with local storage persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEMO_USERS.individual, // default signed in for instant evaluation
      token: 'nexus_jwt_demo_token_session_2026',
      isLoading: false,
      setUser: (user, token = null) => set({ user, token: token || (user ? 'nexus_jwt_token' : null) }),
      logout: () => set({ user: null, token: null }),
      switchDemoRole: (role: UserRole) => {
        set({ user: DEMO_USERS[role], token: `nexus_jwt_${role}_token` });
      },
    }),
    {
      name: 'nexus-auth-storage',
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
