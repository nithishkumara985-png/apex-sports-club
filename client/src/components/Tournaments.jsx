import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Plus, 
  Calendar, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Swords, 
  ChevronRight,
  Edit2,
  X
} from 'lucide-react';
import { dataService } from '../lib/supabase';

export default function Tournaments({ currentRole }) {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [matchEditModal, setMatchEditModal] = useState(null);
  const [matchScore, setMatchScore] = useState('');
  const [matchWinner, setMatchWinner] = useState('');

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    const list = await dataService.getTournaments();
    setTournaments(list);
    if (list.length > 0) {
      setSelectedTournament(list[0]);
    }
  };

  const handleUpdateMatch = async (e) => {
    e.preventDefault();
    if (!matchEditModal || !selectedTournament) return;
    await dataService.updateTournamentMatch(selectedTournament.id, matchEditModal.id, {
      score: matchScore,
      winner: matchWinner,
      status: matchWinner ? 'completed' : 'scheduled'
    });
    setMatchEditModal(null);
    await loadTournaments();
  };

  // Group matches by round for bracket view
  const matchesByRound = (selectedTournament?.matches || []).reduce((acc, m) => {
    const r = m.round || 1;
    if (!acc[r]) acc[r] = [];
    acc[r].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Tournaments & Championship Brackets
          </h1>
          <p className="text-xs text-slate-400">Interactive elimination brackets, fixtures, and championship trophy tracking</p>
        </div>
      </div>

      {/* Tournament Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {tournaments.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTournament(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              selectedTournament?.id === t.id
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{t.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-amber-200">
              {t.sport}
            </span>
          </button>
        ))}
      </div>

      {/* Tournament Overview Card */}
      {selectedTournament && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {selectedTournament.format} Tournament
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                  {selectedTournament.sport}
                </span>
              </div>
              <h2 className="text-xl font-black text-white">{selectedTournament.name}</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {selectedTournament.description || 'Annual club championship event'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-500 block">Prize Pool</span>
                <span className="font-extrabold text-amber-400">{selectedTournament.prize}</span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="text-[11px] text-slate-500 block">Venue</span>
                <span className="font-semibold text-white">{selectedTournament.venue}</span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="text-[11px] text-slate-500 block">Window</span>
                <span className="font-semibold text-white">
                  {new Date(selectedTournament.start_date).toLocaleDateString()} - {new Date(selectedTournament.end_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Bracket Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 overflow-x-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Swords className="w-4 h-4 text-emerald-400" />
            Tournament Elimination Bracket Tree
          </h3>
          <span className="text-xs text-slate-400">Click any match to record score & advance winner</span>
        </div>

        {/* Tree Bracket Columns */}
        <div className="min-w-[800px] grid grid-cols-3 gap-8 pt-2">
          {/* Round 1: Quarter-Finals */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Quarter-Finals</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Round 1</span>
            </div>

            <div className="space-y-4">
              {(matchesByRound[1] || []).map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    if (currentRole === 'admin' || currentRole === 'coach') {
                      setMatchEditModal(m);
                      setMatchScore(m.score || '');
                      setMatchWinner(m.winner || m.team1);
                    }
                  }}
                  className={`p-3.5 rounded-xl border bg-slate-950/70 hover:border-slate-600 transition cursor-pointer relative group ${
                    m.status === 'completed' ? 'border-slate-800' : 'border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-2">
                    <span>{m.round_name}</span>
                    <span className={m.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}>
                      {m.status}
                    </span>
                  </div>

                  {/* Team 1 */}
                  <div className={`flex items-center justify-between p-1.5 rounded-lg text-xs font-semibold ${
                    m.winner === m.team1 ? 'bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20' : 'text-slate-300'
                  }`}>
                    <span className="truncate">{m.team1}</span>
                    {m.winner === m.team1 && <Trophy className="w-3 h-3 text-amber-400 shrink-0 ml-1" />}
                  </div>

                  <div className="my-1 border-t border-slate-800/80"></div>

                  {/* Team 2 */}
                  <div className={`flex items-center justify-between p-1.5 rounded-lg text-xs font-semibold ${
                    m.winner === m.team2 ? 'bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20' : 'text-slate-300'
                  }`}>
                    <span className="truncate">{m.team2}</span>
                    {m.winner === m.team2 && <Trophy className="w-3 h-3 text-amber-400 shrink-0 ml-1" />}
                  </div>

                  {m.score && (
                    <div className="mt-2 text-right">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {m.score}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Round 2: Semi-Finals */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Semi-Finals</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Round 2</span>
            </div>

            <div className="space-y-12 pt-6">
              {(matchesByRound[2] || []).map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    if (currentRole === 'admin' || currentRole === 'coach') {
                      setMatchEditModal(m);
                      setMatchScore(m.score || '');
                      setMatchWinner(m.winner || m.team1);
                    }
                  }}
                  className={`p-3.5 rounded-xl border bg-slate-950/70 hover:border-slate-600 transition cursor-pointer relative group ${
                    m.status === 'completed' ? 'border-slate-800' : 'border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-2">
                    <span>{m.round_name}</span>
                    <span className={m.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}>
                      {m.status}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-1.5 rounded-lg text-xs font-semibold ${
                    m.winner === m.team1 ? 'bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20' : 'text-slate-300'
                  }`}>
                    <span className="truncate">{m.team1}</span>
                    {m.winner === m.team1 && <Trophy className="w-3 h-3 text-amber-400 shrink-0 ml-1" />}
                  </div>

                  <div className="my-1 border-t border-slate-800/80"></div>

                  <div className={`flex items-center justify-between p-1.5 rounded-lg text-xs font-semibold ${
                    m.winner === m.team2 ? 'bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20' : 'text-slate-300'
                  }`}>
                    <span className="truncate">{m.team2}</span>
                    {m.winner === m.team2 && <Trophy className="w-3 h-3 text-amber-400 shrink-0 ml-1" />}
                  </div>

                  {m.score && (
                    <div className="mt-2 text-right">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {m.score}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Round 3: Championship Final */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider pb-2 border-b border-amber-500/30 flex items-center justify-between">
              <span>Grand Final</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">Trophy</span>
            </div>

            <div className="pt-24">
              {(matchesByRound[3] || []).map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    if (currentRole === 'admin' || currentRole === 'coach') {
                      setMatchEditModal(m);
                      setMatchScore(m.score || '');
                      setMatchWinner(m.winner || m.team1);
                    }
                  }}
                  className="p-4 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-950 to-slate-900 shadow-xl shadow-amber-500/5 hover:border-amber-400 transition cursor-pointer relative"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" /> {m.round_name}
                    </span>
                    <span className="uppercase text-[10px]">{m.status}</span>
                  </div>

                  <div className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold ${
                    m.winner === m.team1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-200'
                  }`}>
                    <span>{m.team1}</span>
                    {m.winner === m.team1 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                  </div>

                  <div className="my-2 text-center text-[10px] uppercase font-bold text-slate-500">
                    VS
                  </div>

                  <div className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold ${
                    m.winner === m.team2 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-200'
                  }`}>
                    <span>{m.team2}</span>
                    {m.winner === m.team2 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                  </div>

                  {m.score && (
                    <div className="mt-3 text-center">
                      <span className="text-xs font-mono font-black px-3 py-1 rounded-lg bg-slate-900 text-amber-400 border border-slate-800">
                        Final Score: {m.score}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Match Score & Winner Modal */}
      {matchEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Update Match Result</h3>
              <button onClick={() => setMatchEditModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              <span className="text-white font-semibold">{matchEditModal.team1}</span> vs <span className="text-white font-semibold">{matchEditModal.team2}</span>
            </p>

            <form onSubmit={handleUpdateMatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Score Result</label>
                <input
                  type="text"
                  placeholder="e.g. 3 - 1"
                  value={matchScore}
                  onChange={(e) => setMatchScore(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none font-mono text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Match Winner (Advances)</label>
                <select
                  value={matchWinner}
                  onChange={(e) => setMatchWinner(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Match Drawn / Pending --</option>
                  <option value={matchEditModal.team1}>{matchEditModal.team1}</option>
                  <option value={matchEditModal.team2}>{matchEditModal.team2}</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMatchEditModal(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow"
                >
                  Save Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
