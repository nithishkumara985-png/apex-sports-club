import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Plus, 
  Pin, 
  Trophy, 
  AlertTriangle, 
  Calendar, 
  Info, 
  Trash2, 
  X,
  Clock
} from 'lucide-react';
import { dataService } from '../lib/supabase';

export default function Announcements({ currentRole }) {
  const [announcements, setAnnouncements] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'general',
    pinned: false,
    author_name: 'Club Administration'
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const list = await dataService.getAnnouncements();
    setAnnouncements(list);
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    await dataService.addAnnouncement(newNotice);
    setIsAddOpen(false);
    setNewNotice({
      title: '',
      content: '',
      category: 'general',
      pinned: false,
      author_name: 'Club Administration'
    });
    await loadAnnouncements();
  };

  const filtered = announcements.filter(a => {
    if (categoryFilter === 'all') return true;
    return a.category === categoryFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-emerald-400" />
            Club Announcements & Bulletins
          </h1>
          <p className="text-xs text-slate-400">Official notices, tournament news, match-day directions, and club achievements</p>
        </div>

        {(currentRole === 'admin' || currentRole === 'coach') && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Post New Bulletin
          </button>
        )}
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'all', label: 'All Notices' },
          { id: 'urgent', label: 'Urgent Alerts' },
          { id: 'event', label: 'Event Updates' },
          { id: 'achievement', label: 'Trophies & Honors' },
          { id: 'general', label: 'General Club News' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              categoryFilter === cat.id
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition shadow-sm space-y-3 ${
              item.pinned
                ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {item.pinned && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Pin className="w-2.5 h-2.5" /> Pinned
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  item.category === 'urgent'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : item.category === 'achievement'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : item.category === 'event'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <span className="text-xs font-semibold text-slate-400 shrink-0">
                Posted by {item.author_name}
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{item.title}</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Post Bulletin Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-400" /> Post New Bulletin
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bulletin Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Update for Championship Final"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newNotice.category}
                  onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="general">General News</option>
                  <option value="urgent">Urgent Notice</option>
                  <option value="event">Event Notice</option>
                  <option value="achievement">Achievement / Victory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bulletin Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Write notice details for all athletes and coaches..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={newNotice.pinned}
                  onChange={(e) => setNewNotice({ ...newNotice, pinned: e.target.checked })}
                  className="rounded border-slate-800 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="pinned" className="text-xs text-slate-300 cursor-pointer flex items-center gap-1 font-medium">
                  <Pin className="w-3 h-3 text-emerald-400" /> Pin this notice to the top
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Publish Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
