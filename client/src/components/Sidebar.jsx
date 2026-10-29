import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  Calendar, 
  ClipboardCheck, 
  CreditCard, 
  Trophy, 
  Megaphone,
  Settings,
  Database
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenSupabaseModal }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard },
    { id: 'members', label: 'Member Directory', icon: Users },
    { id: 'teams', label: 'Teams & Squads', icon: ShieldAlert },
    { id: 'events', label: 'Fixtures & Schedule', icon: Calendar },
    { id: 'attendance', label: 'Attendance Tracking', icon: ClipboardCheck },
    { id: 'fees', label: 'Fee & Billing', icon: CreditCard },
    { id: 'tournaments', label: 'Tournaments & Brackets', icon: Trophy },
    { id: 'announcements', label: 'News & Bulletins', icon: Megaphone },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Supabase Integration Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <button
          onClick={onOpenSupabaseModal}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/60 transition group"
        >
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition transform" />
            <span className="text-slate-200">Supabase Config</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            SQL
          </span>
        </button>
      </div>
    </aside>
  );
}
