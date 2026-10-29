import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Users, 
  UserPlus, 
  Shirt, 
  Award, 
  X,
  ChevronRight
} from 'lucide-react';
import { dataService } from '../lib/supabase';

export default function Teams({ currentRole }) {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);

  // Form states
  const [newTeam, setNewTeam] = useState({
    name: '',
    sport: 'Football',
    coach_name: 'Coach David Miller',
    description: '',
    max_members: 20
  });

  const [newPlayer, setNewPlayer] = useState({
    member_id: '',
    position: 'Forward',
    jersey_number: '9'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [teamData, memberData] = await Promise.all([
      dataService.getTeams(),
      dataService.getMembers()
    ]);
    setTeams(teamData);
    setMembers(memberData);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.name) return;
    await dataService.addTeam(newTeam);
    setNewTeam({ name: '', sport: 'Football', coach_name: 'Coach David Miller', description: '', max_members: 20 });
    setIsAddTeamOpen(false);
    await loadData();
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!selectedTeam || !newPlayer.member_id) return;
    const athlete = members.find(m => m.id === newPlayer.member_id);
    if (!athlete) return;

    await dataService.addMemberToTeam(selectedTeam.id, {
      id: athlete.id,
      name: athlete.name,
      position: newPlayer.position,
      jersey_number: newPlayer.jersey_number
    });

    setIsAddPlayerOpen(false);
    setNewPlayer({ member_id: '', position: 'Forward', jersey_number: '9' });
    await loadData();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            Squads & Team Rosters
          </h1>
          <p className="text-xs text-slate-400">Manage competitive rosters, coaching assignments, and jersey line-ups</p>
        </div>

        {(currentRole === 'admin' || currentRole === 'coach') && (
          <button
            onClick={() => setIsAddTeamOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Create New Squad
          </button>
        )}
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition"
          >
            {/* Team Card Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {team.sport}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{team.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{team.description || 'Official club squad'}</p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400 block">Head Coach</span>
                <span className="text-xs font-bold text-emerald-400">{team.coach_name}</span>
              </div>
            </div>

            {/* Roster Section */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Roster ({team.members?.length || 0} / {team.max_members})
                </span>

                {(currentRole === 'admin' || currentRole === 'coach') && (
                  <button
                    onClick={() => {
                      setSelectedTeam(team);
                      setIsAddPlayerOpen(true);
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                  >
                    <UserPlus className="w-3 h-3" /> Assign Player
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {team.members && team.members.length > 0 ? (
                  team.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-lg bg-slate-800 text-emerald-400 font-mono font-bold flex items-center justify-center text-[10px] border border-slate-700">
                          #{member.jersey_number || '0'}
                        </div>
                        <span className="font-semibold text-white">{member.name}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                        {member.position || 'Player'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-slate-500 italic">
                    No athletes assigned to this squad yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {isAddTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" /> Create New Team Squad
              </h3>
              <button onClick={() => setIsAddTeamOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Squad Name</label>
                <input
                  type="text"
                  required
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  placeholder="e.g. Apex Falcons U-21"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sport Discipline</label>
                  <select
                    value={newTeam.sport}
                    onChange={(e) => setNewTeam({ ...newTeam, sport: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Cricket">Cricket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={newTeam.max_members}
                    onChange={(e) => setNewTeam({ ...newTeam, max_members: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Head Coach</label>
                <input
                  type="text"
                  value={newTeam.coach_name}
                  onChange={(e) => setNewTeam({ ...newTeam, coach_name: e.target.value })}
                  placeholder="e.g. Coach David Miller"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Notes</label>
                <textarea
                  rows="2"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  placeholder="e.g. Premier division squad competing in local and regional leagues."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTeamOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Save Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Player Modal */}
      {isAddPlayerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" /> Assign Player to {selectedTeam?.name}
              </h3>
              <button onClick={() => setIsAddPlayerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPlayer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Club Athlete</label>
                <select
                  required
                  value={newPlayer.member_id}
                  onChange={(e) => setNewPlayer({ ...newPlayer, member_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Choose Athlete --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.sport} - {m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Position / Role</label>
                  <input
                    type="text"
                    required
                    value={newPlayer.position}
                    onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                    placeholder="e.g. Striker, Point Guard"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jersey Number</label>
                  <input
                    type="text"
                    required
                    value={newPlayer.jersey_number}
                    onChange={(e) => setNewPlayer({ ...newPlayer, jersey_number: e.target.value })}
                    placeholder="e.g. 10"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPlayerOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Assign to Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
