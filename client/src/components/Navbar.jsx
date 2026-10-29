import React from 'react';
import { Trophy, Database, Shield, UserCheck, Users, Settings, Bell } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Navbar({ currentRole, setCurrentRole, onOpenSupabaseModal }) {
  const isConnected = isSupabaseConfigured();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
      {/* Brand logo & Title */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
          <Trophy className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">APEX SPORTS CLUB</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Multi-Sport OS
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">Athletics & Club Management Platform</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Supabase Status Pill */}
        <button
          onClick={onOpenSupabaseModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
            isConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
          }`}
          title="Click to configure Supabase backend"
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{isConnected ? 'Supabase Connected' : 'Supabase Demo Mode'}</span>
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
        </button>

        {/* Role Switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setCurrentRole('admin')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
              currentRole === 'admin'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">Admin</span>
          </button>
          <button
            onClick={() => setCurrentRole('coach')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
              currentRole === 'coach'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span className="hidden sm:inline">Coach</span>
          </button>
          <button
            onClick={() => setCurrentRole('member')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
              currentRole === 'member'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3 h-3" />
            <span className="hidden sm:inline">Athlete</span>
          </button>
        </div>

        {/* User Avatar */}
        <div className="flex items-center space-x-2 pl-1 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400 uppercase">
            {currentRole === 'admin' ? 'AD' : currentRole === 'coach' ? 'CH' : 'MB'}
          </div>
        </div>
      </div>
    </header>
  );
}
