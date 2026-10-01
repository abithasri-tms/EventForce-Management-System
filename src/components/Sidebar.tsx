import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Handshake,
  Building2,
  Network,
  Star,
  CheckSquare,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  pendingApprovalsCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'vendors', label: 'Vendors', icon: Handshake },
    { id: 'venues', label: 'Venues', icon: Building2 },
    { id: 'eventVendors', label: 'Event Vendors', icon: Network },
    { id: 'feedback', label: 'Feedback', icon: Star },
    {
      id: 'approvals',
      label: 'Approvals & Flows',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined
    },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'docs', label: 'Project Docs & Viva', icon: BookOpen }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 min-h-screen">
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-sm">
          EF
        </div>
        <div>
          <div className="font-bold text-white text-sm tracking-wide">EVENTFORCE</div>
          <div className="text-[11px] text-slate-400">Naan Mudhalvan Edition</div>
        </div>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-900">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>JSON Persistence Active</span>
      </div>
    </aside>
  );
};
