import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Save, 
  Users,
  Award
} from 'lucide-react';
import { dataService } from '../lib/supabase';

export default function Attendance({ currentRole }) {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [records, setRecords] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const eventsData = await dataService.getEvents();
    setEvents(eventsData);
    if (eventsData.length > 0) {
      setSelectedEventId(eventsData[0].id);
      loadAttendance(eventsData[0].id);
    }
  };

  const loadAttendance = async (eventId) => {
    const list = await dataService.getAttendance(eventId);
    setRecords(list);
  };

  const handleEventChange = (e) => {
    const id = Number(e.target.value);
    setSelectedEventId(id);
    loadAttendance(id);
  };

  const handleStatusChange = (userId, status) => {
    setRecords(prev => prev.map(r => r.user_id === userId ? { ...r, status } : r));
    setSavedSuccess(false);
  };

  const handleNotesChange = (userId, notes) => {
    setRecords(prev => prev.map(r => r.user_id === userId ? { ...r, notes } : r));
    setSavedSuccess(false);
  };

  const handleMarkAll = (status) => {
    setRecords(prev => prev.map(r => ({ ...r, status })));
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    if (!selectedEventId) return;
    setSaving(true);
    await dataService.saveAttendance(selectedEventId, records);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const currentEvent = events.find(e => e.id === selectedEventId);

  // Compute metrics
  const total = records.length;
  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const excusedCount = records.filter(r => r.status === 'excused').length;
  const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-emerald-400" />
            Athlete Attendance Tracking
          </h1>
          <p className="text-xs text-slate-400">Log training presence, match-day arrival, and participation records</p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Database
            </span>
          )}

          {(currentRole === 'admin' || currentRole === 'coach') && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Save Attendance
            </button>
          )}
        </div>
      </div>

      {/* Select Event and Summary Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="w-full sm:w-96">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Select Fixture or Training Session:
            </label>
            <select
              value={selectedEventId || ''}
              onChange={handleEventChange}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              {events.map(e => (
                <option key={e.id} value={e.id}>
                  [{e.type.toUpperCase()}] {e.title} - {new Date(e.start_datetime).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {(currentRole === 'admin' || currentRole === 'coach') && (
            <div className="flex items-center gap-2 self-start sm:self-end">
              <span className="text-[11px] font-semibold text-slate-400">Quick Fill:</span>
              <button
                onClick={() => handleMarkAll('present')}
                className="px-2.5 py-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition"
              >
                All Present
              </button>
              <button
                onClick={() => handleMarkAll('absent')}
                className="px-2.5 py-1 text-[11px] font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition"
              >
                All Absent
              </button>
            </div>
          )}
        </div>

        {/* Attendance Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block">Attendance Rate</span>
            <span className="text-lg font-black text-emerald-400">{attendanceRate}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block">Present</span>
            <span className="text-lg font-black text-white">{presentCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block">Late</span>
            <span className="text-lg font-black text-amber-400">{lateCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block">Excused</span>
            <span className="text-lg font-black text-blue-400">{excusedCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block">Absent</span>
            <span className="text-lg font-black text-rose-400">{absentCount}</span>
          </div>
        </div>
      </div>

      {/* Roster Attendance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Athlete / Member</th>
                <th className="py-3 px-4">Role / Sport</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4">Coaching Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {records.map((rec) => (
                <tr key={rec.user_id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-white">
                    {rec.user_name}
                  </td>

                  <td className="py-3 px-4 text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                      {rec.sport || 'Multi-Sport'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1">
                      {[
                        { id: 'present', label: 'Present', activeBg: 'bg-emerald-600 text-white' },
                        { id: 'late', label: 'Late', activeBg: 'bg-amber-600 text-white' },
                        { id: 'excused', label: 'Excused', activeBg: 'bg-blue-600 text-white' },
                        { id: 'absent', label: 'Absent', activeBg: 'bg-rose-600 text-white' }
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          disabled={currentRole === 'member'}
                          onClick={() => handleStatusChange(rec.user_id, st.id)}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg transition ${
                            rec.status === st.id
                              ? `${st.activeBg} shadow`
                              : 'text-slate-400 hover:text-white'
                          } ${currentRole === 'member' ? 'cursor-default opacity-80' : ''}`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <input
                      type="text"
                      disabled={currentRole === 'member'}
                      value={rec.notes || ''}
                      onChange={(e) => handleNotesChange(rec.user_id, e.target.value)}
                      placeholder={currentRole === 'member' ? 'No remarks' : 'e.g. Cleared by physio, on time'}
                      className="w-full max-w-xs px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
