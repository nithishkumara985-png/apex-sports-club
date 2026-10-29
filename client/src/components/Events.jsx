import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Edit3, 
  X,
  Swords,
  Dumbbell,
  Users2
} from 'lucide-react';
import { dataService } from '../lib/supabase';

export default function Events({ currentRole }) {
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [scoreModalEvent, setScoreModalEvent] = useState(null);
  const [scoreInput, setScoreInput] = useState('');

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'match',
    sport: 'Football',
    venue: 'Apex Central Arena Pitch 1',
    start_datetime: '2026-11-10T16:00',
    end_datetime: '2026-11-10T18:00',
    team_name: 'Apex Thunder Hawks',
    opponent: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [eventsData, teamsData] = await Promise.all([
      dataService.getEvents(),
      dataService.getTeams()
    ]);
    setEvents(eventsData);
    setTeams(teamsData);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title) return;
    await dataService.addEvent(newEvent);
    setIsAddOpen(false);
    setNewEvent({
      title: '',
      type: 'match',
      sport: 'Football',
      venue: 'Apex Central Arena Pitch 1',
      start_datetime: '2026-11-10T16:00',
      end_datetime: '2026-11-10T18:00',
      team_name: 'Apex Thunder Hawks',
      opponent: ''
    });
    await loadData();
  };

  const handleUpdateScore = async (e) => {
    e.preventDefault();
    if (!scoreModalEvent) return;
    await dataService.updateEvent(scoreModalEvent.id, {
      score: scoreInput,
      status: 'completed'
    });
    setScoreModalEvent(null);
    setScoreInput('');
    await loadData();
  };

  const filteredEvents = events.filter(e => {
    if (typeFilter === 'all') return true;
    return e.type === typeFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-400" />
            Fixtures, Matches & Training Schedule
          </h1>
          <p className="text-xs text-slate-400">Coordinate official competitive matches, tactical drills, and team briefings</p>
        </div>

        {(currentRole === 'admin' || currentRole === 'coach') && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Schedule Fixture / Training
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Events' },
          { id: 'match', label: 'Matches & Fixtures' },
          { id: 'training', label: 'Squad Training' },
          { id: 'meeting', label: 'Club Briefings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setTypeFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              typeFilter === tab.id
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  evt.type === 'match'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : evt.type === 'training'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {evt.type}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                  {evt.sport}
                </span>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                evt.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {evt.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{evt.title}</h3>
              {evt.opponent && (
                <div className="text-xs font-semibold text-rose-400 mt-0.5 flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5" />
                  vs. {evt.opponent}
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>
                  {new Date(evt.start_datetime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(evt.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{evt.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Squad: {evt.team_name || 'All Club'}</span>
              </div>
            </div>

            {/* Score & Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                {evt.score ? (
                  <div className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Result: {evt.score}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">Score not recorded</span>
                )}
              </div>

              {(currentRole === 'admin' || currentRole === 'coach') && (
                <button
                  onClick={() => {
                    setScoreModalEvent(evt);
                    setScoreInput(evt.score || '');
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3 text-emerald-400" /> Record Score
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Schedule Event / Fixture
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Thunder Hawks vs Metro FC"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="match">Match / Fixture</option>
                    <option value="training">Training Session</option>
                    <option value="meeting">Briefing / Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sport</label>
                  <select
                    value={newEvent.sport}
                    onChange={(e) => setNewEvent({ ...newEvent, sport: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Cricket">Cricket</option>
                    <option value="All Sports">All Sports</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Participating Squad</label>
                <select
                  value={newEvent.team_name}
                  onChange={(e) => setNewEvent({ ...newEvent, team_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="General Club">All Athletes / General Club</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.sport})</option>
                  ))}
                </select>
              </div>

              {newEvent.type === 'match' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Opponent Club / Team</label>
                  <input
                    type="text"
                    value={newEvent.opponent}
                    onChange={(e) => setNewEvent({ ...newEvent, opponent: e.target.value })}
                    placeholder="e.g. Metro FC"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Pitch</label>
                <input
                  type="text"
                  required
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  placeholder="e.g. Main Stadium Pitch A"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.start_datetime}
                    onChange={(e) => setNewEvent({ ...newEvent, start_datetime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.end_datetime}
                    onChange={(e) => setNewEvent({ ...newEvent, end_datetime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
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
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Score Modal */}
      {scoreModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Record Final Score</h3>
              <button onClick={() => setScoreModalEvent(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter match result for <span className="text-white font-semibold">{scoreModalEvent.title}</span>
            </p>

            <form onSubmit={handleUpdateScore} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Score / Final Result</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 - 1 or 88 - 82"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none text-center font-bold font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setScoreModalEvent(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
