'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { UserRole, CurrentUser } from '@/lib/types';

const DEMO_USERS: Record<UserRole, CurrentUser> = {
  admin: {
    id: 'usr-admin',
    name: 'Aria Chen',
    email: 'aria.chen@cloudmetrics.io',
    role: 'admin',
  },
  analyst: {
    id: 'usr-analyst',
    name: 'Sophie Kim',
    email: 'sophie.kim@cloudmetrics.io',
    role: 'analyst',
  },
  viewer: {
    id: 'usr-viewer',
    name: 'James Thompson',
    email: 'james.t@cloudmetrics.io',
    role: 'viewer',
  },
};

interface RoleContextValue {
  currentUser: CurrentUser;
  setRole: (role: UserRole) => void;
  can: (action: 'manage_team' | 'export_data' | 'view_billing' | 'edit_settings') => boolean;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin');
  const currentUser = DEMO_USERS[role];

  function can(action: 'manage_team' | 'export_data' | 'view_billing' | 'edit_settings'): boolean {
    switch (action) {
      case 'manage_team':    return role === 'admin';
      case 'export_data':    return role === 'admin' || role === 'analyst';
      case 'view_billing':   return role === 'admin';
      case 'edit_settings':  return role === 'admin';
    }
  }

  return (
    <RoleContext.Provider value={{ currentUser, setRole, can }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
