'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, LayoutGrid, BarChart3, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/bio-pages', label: 'Bio Pages', icon: LayoutGrid },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-50 h-screen border-r border-gray-200 bg-white transition-all duration-300',
        open ? 'w-64' : 'w-0 overflow-hidden'
      )}
    >
      <div className="flex h-full flex-col p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">BioLink</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                {open && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2">
          <button
            onClick={onToggle}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {open ? <span>Collapse</span> : <span>Expand</span>}
          </button>

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
              {open && <span>Sign Out</span>}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
