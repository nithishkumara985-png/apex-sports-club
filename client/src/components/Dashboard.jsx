import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Calendar, 
  CreditCard, 
  Trophy, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Activity
} from 'lucide-react';
import { dataService } from '../lib/supabase';

export default function Dashboard({ setActiveTab }) {
  const [stats, setStats] = useState({
    totalAthletes: 0,
    totalCoaches: 0,
    totalTeams: 0,
    upcomingEvents: 0,
    totalCollected: 0,
    totalPending: 0,
    activeTournaments: 0
  });
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsData, eventsData, announcementsData] = await Promise.all([
        dataService.getStats(),
        dataService.getEvents(),
        dataService.getAnnouncements()
      ]);
      setStats(statsData);
      setEvents(eventsData.slice(0, 4));
      setAnnouncements(announcementsData.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Registered Athletes', value: stats.totalAthletes, sub: '+4 this month', icon: Users, color: 'emerald' },
    { title: 'Coaching Staff', value: stats.totalCoaches, sub: 'All sports active', icon: ShieldAlert, color: 'blue' },
    { title: 'Active Squads', value: stats.totalTeams, sub: '4 core disciplines', icon: Activity, color: 'purple' },
    { title: 'Upcoming Fixtures', value: stats.upcomingEvents, sub: 'Next 14 days', icon: Calendar, color: 'amber' },
    { title: 'Fees Collected', value: `$${stats.totalCollected.toLocaleString()}`, sub: '92% collection rate', icon: CreditCard, color: 'teal' },
    { title: 'Pending Dues', value: `$${stats.totalPending.toLocaleString()}`, sub: 'Action required', icon: AlertCircle, color: 'rose' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[11px] uppercase tracking-wide border border-emerald-500/30">
                Live Management Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Apex Sports Club Management
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Monitor team schedules, track athlete attendance, manage club membership billing, and review tournament fixtures in real time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('events')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Schedule Event
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" /> Register Athlete
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition shadow-sm group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 truncate">{card.title}</span>
                <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 group-hover:text-emerald-400 transition">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl font-extrabold text-white tracking-tight">{card.value}</div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                <span>{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Upcoming Fixtures & Recent Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Fixtures & Training */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Upcoming Matches & Training
              </h2>
              <p className="text-xs text-slate-400">Scheduled events across all squads</p>
            </div>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              Full Calendar <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    evt.type === 'match' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                      : evt.type === 'training'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {evt.type}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{evt.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(evt.start_datetime).toLocaleDateString()} {new Date(evt.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {evt.venue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-700 text-slate-300">
                    {evt.sport}
                  </span>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 rounded-lg border border-emerald-500/20 transition"
                  >
                    Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Club Bulletins & Announcements */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Latest Club Bulletins
              </h2>
              <p className="text-xs text-slate-400">Notices and announcements</p>
            </div>
            <button
              onClick={() => setActiveTab('announcements')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    item.category === 'urgent'
                      ? 'bg-rose-500/20 text-rose-300'
                      : item.category === 'achievement'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{item.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
