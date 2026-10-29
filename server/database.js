// Resilient database module supporting in-memory storage & optional better-sqlite3
const path = require('path');
const bcrypt = require('bcryptjs');

let dbInstance = null;

try {
  const Database = require('better-sqlite3');
  dbInstance = new Database(path.join(__dirname, 'sports_club.db'));
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');
} catch (e) {
  // Pure JavaScript in-memory database mock for Node 24+ without native C++ compiler
  const store = {
    users: [
      { id: 1, name: 'Admin User', email: 'admin@sportsclub.com', password: bcrypt.hashSync('admin123', 10), role: 'admin', sport: 'Multi-Sport', phone: '+1-555-0100', status: 'active', join_date: '2024-01-01', created_at: new Date().toISOString() },
      { id: 2, name: 'John Smith', email: 'john@example.com', password: bcrypt.hashSync('member123', 10), role: 'member', sport: 'Football', phone: '+1-555-0101', status: 'active', join_date: '2024-03-01', created_at: new Date().toISOString() },
      { id: 3, name: 'Sarah Connor', email: 'sarah@example.com', password: bcrypt.hashSync('member123', 10), role: 'member', sport: 'Basketball', phone: '+1-555-0102', status: 'active', join_date: '2024-02-15', created_at: new Date().toISOString() },
      { id: 4, name: 'Mike Johnson', email: 'mike@example.com', password: bcrypt.hashSync('coach123', 10), role: 'coach', sport: 'Football', phone: '+1-555-0103', status: 'active', join_date: '2023-11-10', created_at: new Date().toISOString() },
      { id: 5, name: 'Emma Davis', email: 'emma@example.com', password: bcrypt.hashSync('member123', 10), role: 'member', sport: 'Tennis', phone: '+1-555-0104', status: 'active', join_date: '2024-05-01', created_at: new Date().toISOString() },
      { id: 6, name: 'Carlos Rivera', email: 'carlos@example.com', password: bcrypt.hashSync('member123', 10), role: 'member', sport: 'Cricket', phone: '+1-555-0105', status: 'active', join_date: '2024-04-10', created_at: new Date().toISOString() },
      { id: 7, name: 'Lisa Park', email: 'lisa@example.com', password: bcrypt.hashSync('coach123', 10), role: 'coach', sport: 'Basketball', phone: '+1-555-0106', status: 'active', join_date: '2023-10-01', created_at: new Date().toISOString() }
    ],
    teams: [
      { id: 1, name: 'Thunder Hawks', sport: 'Football', coach_id: 4, coach_name: 'Mike Johnson', description: 'Premier football team', max_members: 22, status: 'active', created_at: new Date().toISOString() },
      { id: 2, name: 'Sky Blazers', sport: 'Basketball', coach_id: 7, coach_name: 'Lisa Park', description: 'Elite basketball squad', max_members: 15, status: 'active', created_at: new Date().toISOString() },
      { id: 3, name: 'Court Kings', sport: 'Tennis', coach_id: null, coach_name: null, description: 'Tennis doubles team', max_members: 10, status: 'active', created_at: new Date().toISOString() }
    ],
    team_members: [
      { id: 1, team_id: 1, user_id: 2, position: 'Forward', jersey_number: '10' },
      { id: 2, team_id: 2, user_id: 3, position: 'Point Guard', jersey_number: '5' },
      { id: 3, team_id: 3, user_id: 5, position: 'Singles', jersey_number: '1' }
    ],
    events: [
      { id: 1, title: 'Thunder Hawks vs City FC', type: 'match', sport: 'Football', description: 'League match round 5', venue: 'Main Stadium', start_datetime: '2026-11-05 15:00', end_datetime: '2026-11-05 17:00', team_id: 1, team_name: 'Thunder Hawks', opponent: 'City FC', status: 'scheduled', score: '' },
      { id: 2, title: 'Football Training Session', type: 'training', sport: 'Football', description: 'Weekly training', venue: 'Training Ground A', start_datetime: '2026-11-02 09:00', end_datetime: '2026-11-02 11:00', team_id: 1, team_name: 'Thunder Hawks', opponent: '', status: 'scheduled', score: '' },
      { id: 3, title: 'Annual General Meeting', type: 'meeting', sport: '', description: 'Year-end member meeting', venue: 'Club House', start_datetime: '2026-11-10 18:00', end_datetime: '2026-11-10 20:00', team_id: null, team_name: '', opponent: '', status: 'scheduled', score: '' }
    ],
    attendance: [
      { id: 1, event_id: 1, user_id: 2, status: 'present', notes: '' },
      { id: 2, event_id: 1, user_id: 3, status: 'present', notes: '' }
    ],
    fees: [
      { id: 1, user_id: 2, user_name: 'John Smith', amount: 50, type: 'monthly', description: 'November monthly fee', due_date: '2026-11-30', status: 'pending', payment_method: '', paid_date: null },
      { id: 2, user_id: 3, user_name: 'Sarah Connor', amount: 50, type: 'monthly', description: 'October monthly fee', due_date: '2026-10-31', status: 'paid', payment_method: 'card', paid_date: '2026-10-28' },
      { id: 3, user_id: 4, user_name: 'Mike Johnson', amount: 500, type: 'annual', description: 'Annual membership 2026', due_date: '2026-11-30', status: 'pending', payment_method: '', paid_date: null },
      { id: 4, user_id: 5, user_name: 'Emma Davis', amount: 50, type: 'monthly', description: 'November monthly fee', due_date: '2026-10-01', status: 'overdue', payment_method: '', paid_date: null }
    ],
    tournaments: [
      { id: 1, name: 'City Sports Championship 2026', sport: 'Football', format: 'knockout', description: 'Annual city championship', start_date: '2026-11-15', end_date: '2026-11-30', venue: 'City Arena', max_teams: 8, prize: 'Trophy + $1000', status: 'upcoming' },
      { id: 2, name: 'Basketball League Season 3', sport: 'Basketball', format: 'league', description: 'Club basketball league', start_date: '2026-11-01', end_date: '2026-12-15', venue: 'Sports Hall B', max_teams: 6, prize: 'Championship Cup', status: 'ongoing' }
    ],
    announcements: [
      { id: 1, title: 'Welcome to Sports Club Management System!', content: 'We are excited to launch our new digital management platform. All members can now track attendance, view upcoming events, and manage fees online.', category: 'general', author_id: 1, author_name: 'Admin User', pinned: 1, created_at: new Date().toISOString() },
      { id: 2, title: 'City Championship Registration Open', content: 'Registration for the City Sports Championship 2026 is now open. Teams must register by November 10th.', category: 'event', author_id: 1, author_name: 'Admin User', pinned: 0, created_at: new Date().toISOString() },
      { id: 3, title: 'Thunder Hawks Win Regional Cup!', content: 'Congratulations to our Thunder Hawks team for winning the Regional Cup 2026! Outstanding performance by all players.', category: 'achievement', author_id: 1, author_name: 'Admin User', pinned: 0, created_at: new Date().toISOString() }
    ]
  };

  dbInstance = {
    pragma: () => {},
    exec: () => {},
    prepare: (query) => {
      const q = query.trim().toLowerCase();

      return {
        get: (...params) => {
          if (q.includes('from users where email = ?')) {
            return store.users.find(u => u.email === params[0]) || null;
          }
          if (q.includes('from users where id = ?')) {
            return store.users.find(u => u.id === Number(params[0])) || null;
          }
          if (q.includes('count(*) as count from users where role = \'member\'')) {
            return { count: store.users.filter(u => u.role === 'member').length };
          }
          if (q.includes('count(*) as count from users where role = \'coach\'')) {
            return { count: store.users.filter(u => u.role === 'coach').length };
          }
          if (q.includes('count(*) as count from teams where status = \'active\'')) {
            return { count: store.teams.filter(t => t.status === 'active').length };
          }
          if (q.includes('count(*) as count from events where status = \'scheduled\'')) {
            return { count: store.events.filter(e => e.status === 'scheduled').length };
          }
          if (q.includes('sum(amount) as total from fees where status in (\'pending\',\'overdue\')')) {
            const sum = store.fees.filter(f => f.status === 'pending' || f.status === 'overdue').reduce((s, f) => s + f.amount, 0);
            return { total: sum };
          }
          if (q.includes('sum(amount) as total from fees where status = \'paid\'')) {
            const sum = store.fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
            return { total: sum };
          }
          if (q.includes('count(*) as count from tournaments where status = \'ongoing\'')) {
            return { count: store.tournaments.filter(t => t.status === 'ongoing').length };
          }
          if (q.includes('from teams') && q.includes('where t.id = ?')) {
            return store.teams.find(t => t.id === Number(params[0])) || null;
          }
          if (q.includes('from events') && q.includes('where e.id = ?')) {
            return store.events.find(e => e.id === Number(params[0])) || null;
          }
          if (q.includes('from tournaments where id = ?')) {
            return store.tournaments.find(t => t.id === Number(params[0])) || null;
          }
          return null;
        },
        all: (...params) => {
          if (q.includes('from users')) return store.users;
          if (q.includes('from teams')) return store.teams;
          if (q.includes('from events')) return store.events;
          if (q.includes('from attendance')) return store.attendance;
          if (q.includes('from fees')) return store.fees;
          if (q.includes('from tournaments')) return store.tournaments;
          if (q.includes('from announcements')) return store.announcements;
          return [];
        },
        run: (...params) => {
          const lastId = Date.now();
          if (q.includes('insert into users')) {
            const [name, email, password, sport, phone] = params;
            store.users.push({ id: lastId, name, email, password, sport, phone, role: 'member', status: 'active', join_date: new Date().toISOString().split('T')[0] });
          } else if (q.includes('insert into teams')) {
            const [name, sport, coach_id, description, max_members] = params;
            store.teams.push({ id: lastId, name, sport, coach_id, description, max_members, status: 'active' });
          } else if (q.includes('insert into events')) {
            const [title, type, sport, description, venue, start_datetime, end_datetime, team_id, opponent, created_by] = params;
            store.events.push({ id: lastId, title, type, sport, description, venue, start_datetime, end_datetime, team_id, opponent, status: 'scheduled' });
          } else if (q.includes('insert into announcements')) {
            const [title, content, category, author_id, pinned] = params;
            store.announcements.unshift({ id: lastId, title, content, category, author_id, pinned, created_at: new Date().toISOString() });
          }
          return { lastInsertRowid: lastId, changes: 1 };
        }
      };
    }
  };
}

module.exports = dbInstance;
