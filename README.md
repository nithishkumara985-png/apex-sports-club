# 🏆 Apex Sports Club Management System

A full-stack, multi-sport club management system built with **React**, **Tailwind CSS**, and **Supabase** (with fallback local SQLite / mock database).

---

## 🚀 Key Features

1. **Dashboard & Analytics**: Real-time overview of active athletes, coaching staff, teams, fixtures, and revenue metrics.
2. **Member Directory**: Athlete and staff roster with role assignment (Admin, Coach, Athlete), sport disciplines, and contact profiles.
3. **Teams & Squad Rosters**: Multi-sport squad management (Football, Basketball, Tennis, Cricket), coach assignments, jersey numbers, and positions.
4. **Fixtures & Match Scheduling**: Interactive calendar for matches, training drills, and briefings with match results and score logging.
5. **Attendance Tracking**: 1-click attendance marking (Present, Late, Excused, Absent), attendance rates, and coaching remarks.
6. **Fee & Billing Management**: Dues collection, invoice tracking, overdue alerts, and recorded payment methods.
7. **Tournament Brackets**: Interactive elimination tournament brackets (Quarter-Finals ➔ Semi-Finals ➔ Grand Final) with live winner advancement.
8. **News & Bulletins**: Categorized club notices (Urgent, Matches, Achievements) with pin-to-top functionality.
9. **Role Switcher**: Quick toggle between **Admin**, **Coach**, and **Athlete** modes directly in the top bar to inspect features from each perspective.

---

## ⚡ Supabase Setup (Simple & Fast)

1. Sign up for free at [supabase.com](https://supabase.com).
2. Create a new project.
3. In the Supabase Dashboard, go to **SQL Editor** ➔ **New Query**, paste the contents of `supabase_schema.sql` (in the project root), and click **Run**.
4. In your project, go to **Project Settings** ➔ **API**, copy your **Project URL** and **anon public key**.
5. Either:
   - Click the **"Supabase Config"** button in the website top navigation bar / sidebar and paste your keys, or
   - Add them to `client/.env`:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

*Note: The website works out-of-the-box in local demo mode even before setting up Supabase!*

---

## 💻 Running the Application

### Frontend (Client):
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend (Express Server - Optional):
```bash
cd server
npm install
npm run start
```
Runs at [http://localhost:5000](http://localhost:5000).

