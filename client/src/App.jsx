import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Teams from './components/Teams';
import Events from './components/Events';
import Attendance from './components/Attendance';
import Fees from './components/Fees';
import Tournaments from './components/Tournaments';
import Announcements from './components/Announcements';
import SupabaseSettingsModal from './components/SupabaseSettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('admin');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === 'members' && <Members currentRole={currentRole} />}
            {activeTab === 'teams' && <Teams currentRole={currentRole} />}
            {activeTab === 'events' && <Events currentRole={currentRole} />}
            {activeTab === 'attendance' && <Attendance currentRole={currentRole} />}
            {activeTab === 'fees' && <Fees currentRole={currentRole} />}
            {activeTab === 'tournaments' && <Tournaments currentRole={currentRole} />}
            {activeTab === 'announcements' && <Announcements currentRole={currentRole} />}
          </div>
        </main>
      </div>

      {/* Supabase Connection Setup Modal */}
      <SupabaseSettingsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}
