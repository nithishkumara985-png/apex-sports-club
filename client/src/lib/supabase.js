import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite env or localStorage override
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const customUrl = localStorage.getItem('SPORTS_SUPABASE_URL') || '';
const customKey = localStorage.getItem('SPORTS_SUPABASE_KEY') || '';

const supabaseUrl = customUrl || envUrl;
const supabaseAnonKey = customKey || envKey;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));
};

export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  hasKey: Boolean(supabaseAnonKey),
  isConfigured: isSupabaseConfigured()
});

export const saveSupabaseConfig = (url, key) => {
  if (url) localStorage.setItem('SPORTS_SUPABASE_URL', url.trim());
  else localStorage.removeItem('SPORTS_SUPABASE_URL');

  if (key) localStorage.setItem('SPORTS_SUPABASE_KEY', key.trim());
  else localStorage.removeItem('SPORTS_SUPABASE_KEY');

  window.location.reload();
};

export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Initial Local / Demo Seed Data
const initialProfiles = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Alexander Wright', email: 'admin@sportsclub.com', role: 'admin', sport: 'Multi-Sport', phone: '+1 (555) 019-2831', status: 'active', join_date: '2024-01-10' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Marcus Sterling', email: 'marcus@example.com', role: 'member', sport: 'Football', phone: '+1 (555) 012-4432', status: 'active', join_date: '2024-03-15' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Elena Rostova', email: 'elena@example.com', role: 'member', sport: 'Basketball', phone: '+1 (555) 018-9921', status: 'active', join_date: '2024-02-20' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Coach David Miller', email: 'coach.david@sportsclub.com', role: 'coach', sport: 'Football', phone: '+1 (555) 017-7744', status: 'active', join_date: '2023-11-01' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Sophia Chen', email: 'sophia@example.com', role: 'member', sport: 'Tennis', phone: '+1 (555) 013-6622', status: 'active', join_date: '2024-05-12' },
  { id: '66666666-6666-6666-6666-666666666666', name: 'Liam O\'Connor', email: 'liam@example.com', role: 'member', sport: 'Cricket', phone: '+1 (555) 015-8833', status: 'active', join_date: '2024-04-05' },
  { id: '77777777-7777-7777-7777-777777777777', name: 'Coach Tara Vance', email: 'coach.tara@sportsclub.com', role: 'coach', sport: 'Basketball', phone: '+1 (555) 014-2200', status: 'active', join_date: '2023-10-15' }
];

const initialTeams = [
  { id: 1, name: 'Apex Thunder Hawks', sport: 'Football', coach_name: 'Coach David Miller', coach_id: '44444444-4444-4444-4444-444444444444', description: 'Men\'s Senior Premier Division XI', max_members: 22, status: 'active', members: [
    { id: '22222222-2222-2222-2222-222222222222', name: 'Marcus Sterling', position: 'Striker', jersey_number: '10' }
  ]},
  { id: 2, name: 'Sky Blazers', sport: 'Basketball', coach_name: 'Coach Tara Vance', coach_id: '77777777-7777-7777-7777-777777777777', description: 'Elite Division 1 Basketball Squad', max_members: 15, status: 'active', members: [
    { id: '33333333-3333-3333-3333-333333333333', name: 'Elena Rostova', position: 'Point Guard', jersey_number: '5' }
  ]},
  { id: 3, name: 'Vanguard Court Kings', sport: 'Tennis', coach_name: 'Head Pro Coach', coach_id: null, description: 'Competitive Singles & Doubles Squad', max_members: 10, status: 'active', members: [
    { id: '55555555-5555-5555-5555-555555555555', name: 'Sophia Chen', position: 'Seed #1 Singles', jersey_number: '1' }
  ]},
  { id: 4, name: 'Royal Strikers CC', sport: 'Cricket', coach_name: 'Coach David Miller', coach_id: '44444444-4444-4444-4444-444444444444', description: 'T20 & Weekend League Squad', max_members: 18, status: 'active', members: [
    { id: '66666666-6666-6666-6666-666666666666', name: 'Liam O\'Connor', position: 'All-Rounder', jersey_number: '7' }
  ]}
];

const initialEvents = [
  { id: 1, title: 'Thunder Hawks vs Metro FC', type: 'match', sport: 'Football', team_id: 1, team_name: 'Apex Thunder Hawks', opponent: 'Metro FC', venue: 'Apex Central Arena Pitch 1', start_datetime: '2026-11-05T15:00', end_datetime: '2026-11-05T17:00', status: 'scheduled', score: '' },
  { id: 2, title: 'First XI Tactical & Set Piece Drills', type: 'training', sport: 'Football', team_id: 1, team_name: 'Apex Thunder Hawks', opponent: '', venue: 'Practice Ground B', start_datetime: '2026-11-02T09:30', end_datetime: '2026-11-02T11:30', status: 'scheduled', score: '' },
  { id: 3, title: 'Sky Blazers vs City Knights', type: 'match', sport: 'Basketball', team_id: 2, team_name: 'Sky Blazers', opponent: 'City Knights', venue: 'Indoor Sports Dome Court 1', start_datetime: '2026-11-08T18:00', end_datetime: '2026-11-08T20:00', status: 'scheduled', score: '' },
  { id: 4, title: 'All-Club Annual Strategy & Awards Meeting', type: 'meeting', sport: 'All Sports', team_id: null, team_name: 'General Club', opponent: '', venue: 'Grand Club Pavilion Hall', start_datetime: '2026-11-12T19:00', end_datetime: '2026-11-12T21:00', status: 'scheduled', score: '' }
];

const initialFees = [
  { id: 1, user_id: '22222222-2222-2222-2222-222222222222', user_name: 'Marcus Sterling', amount: 75.00, type: 'monthly', description: 'November Monthly Club Dues', due_date: '2026-11-20', status: 'pending', payment_method: '', paid_date: null },
  { id: 2, user_id: '33333333-3333-3333-3333-333333333333', user_name: 'Elena Rostova', amount: 75.00, type: 'monthly', description: 'October Monthly Training Fee', due_date: '2026-10-25', status: 'paid', payment_method: 'Credit Card', paid_date: '2026-10-24' },
  { id: 3, user_id: '55555555-5555-5555-5555-555555555555', user_name: 'Sophia Chen', amount: 650.00, type: 'annual', description: 'Annual Premium Athlete Membership', due_date: '2026-11-30', status: 'pending', payment_method: '', paid_date: null },
  { id: 4, user_id: '66666666-6666-6666-6666-666666666666', user_name: 'Liam O\'Connor', amount: 75.00, type: 'monthly', description: 'September Maintenance Fee', due_date: '2026-09-30', status: 'overdue', payment_method: '', paid_date: null }
];

const initialTournaments = [
  {
    id: 1,
    name: 'Metropolitan Autumn Cup 2026',
    sport: 'Football',
    format: 'knockout',
    start_date: '2026-11-15',
    end_date: '2026-11-30',
    venue: 'Apex National Stadium',
    prize: '$3,500 + Championship Cup',
    status: 'upcoming',
    max_teams: 8,
    matches: [
      { id: 101, round: 1, match_number: 1, round_name: 'Quarter-Final 1', team1: 'Apex Thunder Hawks', team2: 'Riverside United', score: '3 - 1', winner: 'Apex Thunder Hawks', status: 'completed' },
      { id: 102, round: 1, match_number: 2, round_name: 'Quarter-Final 2', team1: 'Metro Stars', team2: 'Phoenix Athletic', score: '2 - 0', winner: 'Metro Stars', status: 'completed' },
      { id: 103, round: 1, match_number: 3, round_name: 'Quarter-Final 3', team1: 'Highland Warriors', team2: 'Coastal FC', score: '1 - 2', winner: 'Coastal FC', status: 'completed' },
      { id: 104, round: 1, match_number: 4, round_name: 'Quarter-Final 4', team1: 'Northside Titans', team2: 'Valley Lions', score: '4 - 1', winner: 'Northside Titans', status: 'completed' },
      { id: 201, round: 2, match_number: 1, round_name: 'Semi-Final 1', team1: 'Apex Thunder Hawks', team2: 'Metro Stars', score: '', winner: null, status: 'scheduled' },
      { id: 202, round: 2, match_number: 2, round_name: 'Semi-Final 2', team1: 'Coastal FC', team2: 'Northside Titans', score: '', winner: null, status: 'scheduled' },
      { id: 301, round: 3, match_number: 1, round_name: 'Grand Championship Final', team1: 'TBD', team2: 'TBD', score: '', winner: null, status: 'pending' }
    ]
  },
  {
    id: 2,
    name: 'Inter-Club Basketball Championship',
    sport: 'Basketball',
    format: 'league',
    start_date: '2026-11-01',
    end_date: '2026-12-20',
    venue: 'Olympic Sports Pavilion',
    prize: '$2,000 + Medals',
    status: 'ongoing',
    max_teams: 6,
    matches: [
      { id: 401, round: 1, match_number: 1, round_name: 'Round 1 Match', team1: 'Sky Blazers', team2: 'City Knights', score: '88 - 82', winner: 'Sky Blazers', status: 'completed' },
      { id: 402, round: 1, match_number: 2, round_name: 'Round 1 Match', team1: 'Dunk Masters', team2: 'Hoop Kings', score: '79 - 75', winner: 'Dunk Masters', status: 'completed' }
    ]
  }
];

const initialAnnouncements = [
  {
    id: 1,
    title: 'Welcome to Apex Sports Club Portal (Supabase Ready)',
    content: 'Welcome to our integrated sports management system! Seamlessly track squad rosters, match scheduling, training attendance, fees, and championship tournament brackets. Ready to connect to your Supabase cloud backend with one click.',
    category: 'general',
    author_name: 'Alexander Wright (Admin)',
    pinned: true,
    created_at: '2026-10-25T10:00:00Z'
  },
  {
    id: 2,
    title: 'Autumn Cup 2026 Roster Finalization Deadline',
    content: 'All coaches must submit final 18-player tournament rosters by Friday 5:00 PM. Physical clearance certificates must be uploaded to player profiles.',
    category: 'event',
    author_name: 'Coach David Miller',
    pinned: false,
    created_at: '2026-10-26T14:30:00Z'
  },
  {
    id: 3,
    title: 'Regional Championship Trophy Secured!',
    content: 'Massive congratulations to the Thunder Hawks for their 3-1 victory this past weekend! MVP Marcus Sterling scored a brace in front of a home crowd.',
    category: 'achievement',
    author_name: 'Apex Sports Club Board',
    pinned: false,
    created_at: '2026-10-27T09:15:00Z'
  }
];

// Helper to load or initialize LocalStorage
const loadStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(`SPORTS_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = (key, data) => {
  try {
    localStorage.setItem(`SPORTS_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error('Storage save error:', err);
  }
};

// Unified Data Service that connects to Supabase or seamless local storage
export const dataService = {
  // --- PROFILES / MEMBERS ---
  async getMembers() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    }
    return loadStorage('PROFILES', initialProfiles);
  },

  async addMember(member) {
    const newMember = {
      id: crypto.randomUUID(),
      name: member.name,
      email: member.email,
      role: member.role || 'member',
      sport: member.sport || 'Multi-Sport',
      phone: member.phone || '',
      status: 'active',
      join_date: new Date().toISOString().split('T')[0]
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('profiles').insert([newMember]).select();
      if (!error && data) return data[0];
    }

    const current = loadStorage('PROFILES', initialProfiles);
    const updated = [newMember, ...current];
    saveStorage('PROFILES', updated);
    return newMember;
  },

  async updateMember(id, updates) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select();
      if (!error && data) return data[0];
    }

    const current = loadStorage('PROFILES', initialProfiles);
    const updated = current.map(m => m.id === id ? { ...m, ...updates } : m);
    saveStorage('PROFILES', updated);
    return updated.find(m => m.id === id);
  },

  async deleteMember(id) {
    if (isSupabaseConfigured()) {
      await supabase.from('profiles').delete().eq('id', id);
    }
    const current = loadStorage('PROFILES', initialProfiles);
    const updated = current.filter(m => m.id !== id);
    saveStorage('PROFILES', updated);
    return true;
  },

  // --- TEAMS ---
  async getTeams() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('teams').select(`*, coach:coach_id (name)`);
      if (!error && data && data.length > 0) {
        return data.map(t => ({
          ...t,
          coach_name: t.coach?.name || 'Unassigned',
          members: []
        }));
      }
    }
    return loadStorage('TEAMS', initialTeams);
  },

  async addTeam(team) {
    const newTeam = {
      id: Date.now(),
      name: team.name,
      sport: team.sport,
      coach_name: team.coach_name || 'Coach David Miller',
      description: team.description || '',
      max_members: Number(team.max_members) || 20,
      status: 'active',
      members: []
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('teams').insert([{
        name: newTeam.name,
        sport: newTeam.sport,
        description: newTeam.description,
        max_members: newTeam.max_members
      }]).select();
      if (!error && data) return { ...data[0], members: [] };
    }

    const current = loadStorage('TEAMS', initialTeams);
    const updated = [newTeam, ...current];
    saveStorage('TEAMS', updated);
    return newTeam;
  },

  async addMemberToTeam(teamId, member) {
    const teams = loadStorage('TEAMS', initialTeams);
    const updated = teams.map(t => {
      if (t.id === teamId) {
        const members = t.members || [];
        if (!members.find(m => m.id === member.id)) {
          return { ...t, members: [...members, member] };
        }
      }
      return t;
    });
    saveStorage('TEAMS', updated);
    return updated.find(t => t.id === teamId);
  },

  // --- EVENTS ---
  async getEvents() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('events').select('*').order('start_datetime', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
    return loadStorage('EVENTS', initialEvents);
  },

  async addEvent(event) {
    const newEvent = {
      id: Date.now(),
      title: event.title,
      type: event.type,
      sport: event.sport,
      venue: event.venue,
      start_datetime: event.start_datetime,
      end_datetime: event.end_datetime,
      team_name: event.team_name || 'General Club',
      opponent: event.opponent || '',
      status: 'scheduled',
      score: ''
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('events').insert([newEvent]).select();
      if (!error && data) return data[0];
    }

    const current = loadStorage('EVENTS', initialEvents);
    const updated = [...current, newEvent];
    saveStorage('EVENTS', updated);
    return newEvent;
  },

  async updateEvent(id, updates) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('events').update(updates).eq('id', id).select();
      if (!error && data) return data[0];
    }
    const current = loadStorage('EVENTS', initialEvents);
    const updated = current.map(e => e.id === id ? { ...e, ...updates } : e);
    saveStorage('EVENTS', updated);
    return updated.find(e => e.id === id);
  },

  // --- ATTENDANCE ---
  async getAttendance(eventId) {
    const storageKey = `ATTENDANCE_${eventId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);

    const members = await this.getMembers();
    return members.map(m => ({
      user_id: m.id,
      user_name: m.name,
      role: m.role,
      sport: m.sport,
      status: 'present',
      notes: ''
    }));
  },

  async saveAttendance(eventId, records) {
    const storageKey = `ATTENDANCE_${eventId}`;
    localStorage.setItem(storageKey, JSON.stringify(records));
    return records;
  },

  // --- FEES ---
  async getFees() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('fees').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return loadStorage('FEES', initialFees);
  },

  async addFee(fee) {
    const newFee = {
      id: Date.now(),
      user_id: fee.user_id,
      user_name: fee.user_name,
      amount: parseFloat(fee.amount),
      type: fee.type,
      description: fee.description,
      due_date: fee.due_date,
      status: 'pending',
      payment_method: '',
      paid_date: null
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('fees').insert([newFee]).select();
      if (!error && data) return data[0];
    }

    const current = loadStorage('FEES', initialFees);
    const updated = [newFee, ...current];
    saveStorage('FEES', updated);
    return newFee;
  },

  async markFeePaid(id, method = 'Credit Card') {
    const today = new Date().toISOString().split('T')[0];
    if (isSupabaseConfigured()) {
      await supabase.from('fees').update({ status: 'paid', payment_method: method, paid_date: today }).eq('id', id);
    }
    const current = loadStorage('FEES', initialFees);
    const updated = current.map(f => f.id === id ? { ...f, status: 'paid', payment_method: method, paid_date: today } : f);
    saveStorage('FEES', updated);
    return updated.find(f => f.id === id);
  },

  // --- TOURNAMENTS ---
  async getTournaments() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('tournaments').select('*');
      if (!error && data && data.length > 0) {
        const withMatches = await Promise.all(data.map(async (t) => {
          const { data: matchData } = await supabase.from('tournament_matches').select('*').eq('tournament_id', t.id);
          const fallbackMatches = initialTournaments.find(it => it.id === t.id)?.matches || [];
          return {
            ...t,
            matches: (matchData && matchData.length > 0) ? matchData : fallbackMatches
          };
        }));
        return withMatches;
      }
    }
    return loadStorage('TOURNAMENTS', initialTournaments);
  },

  async updateTournamentMatch(tournamentId, matchId, updates) {
    const tournaments = loadStorage('TOURNAMENTS', initialTournaments);
    const updated = tournaments.map(t => {
      if (t.id === tournamentId) {
        const matches = (t.matches || []).map(m => m.id === matchId ? { ...m, ...updates } : m);
        return { ...t, matches };
      }
      return t;
    });
    saveStorage('TOURNAMENTS', updated);
    return updated.find(t => t.id === tournamentId);
  },

  // --- ANNOUNCEMENTS ---
  async getAnnouncements() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    }
    return loadStorage('ANNOUNCEMENTS', initialAnnouncements);
  },

  async addAnnouncement(announcement) {
    const newAnnouncement = {
      id: Date.now(),
      title: announcement.title,
      content: announcement.content,
      category: announcement.category || 'general',
      author_name: announcement.author_name || 'Sports Club Admin',
      pinned: Boolean(announcement.pinned),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('announcements').insert([newAnnouncement]).select();
      if (!error && data) return data[0];
    }

    const current = loadStorage('ANNOUNCEMENTS', initialAnnouncements);
    const updated = [newAnnouncement, ...current];
    saveStorage('ANNOUNCEMENTS', updated);
    return newAnnouncement;
  },

  // --- STATS ---
  async getStats() {
    const members = await this.getMembers();
    const teams = await this.getTeams();
    const events = await this.getEvents();
    const fees = await this.getFees();
    const tournaments = await this.getTournaments();

    const athletes = members.filter(m => m.role === 'member').length;
    const coaches = members.filter(m => m.role === 'coach').length;
    const totalCollected = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + Number(f.amount), 0);
    const totalPending = fees.filter(f => f.status === 'pending' || f.status === 'overdue').reduce((sum, f) => sum + Number(f.amount), 0);

    return {
      totalAthletes: athletes,
      totalCoaches: coaches,
      totalTeams: teams.length,
      upcomingEvents: events.filter(e => e.status === 'scheduled').length,
      totalCollected,
      totalPending,
      activeTournaments: tournaments.length
    };
  }
};
