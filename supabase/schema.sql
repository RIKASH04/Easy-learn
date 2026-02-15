-- Easy Learn - Supabase schema and RLS
-- Run this in Supabase SQL Editor after creating a project.

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  learning_level text default 'Beginner' check (learning_level in ('Beginner', 'Intermediate', 'Advanced')),
  points integer default 0,
  problems_solved integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- IQ TEST RESULTS
-- ============================================
create table if not exists public.iq_test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null,
  total_questions integer not null default 5,
  level_assigned text not null check (level_assigned in ('Beginner', 'Intermediate', 'Advanced')),
  created_at timestamptz default now()
);

-- ============================================
-- LEARNING MODULES (content by level)
-- ============================================
create table if not exists public.learning_modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  video_url text,
  resource_url text,
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced')),
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================
-- USER LEARNING PROGRESS
-- ============================================
create table if not exists public.user_learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.learning_modules(id) on delete cascade,
  completed_at timestamptz default now(),
  unique(user_id, module_id)
);

-- ============================================
-- ROADMAP STEPS (by level)
-- ============================================
create table if not exists public.roadmap_steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  resource_links jsonb default '[]',  -- [{ "label": "...", "url": "..." }]
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced')),
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================
-- USER ROADMAP COMPLETION
-- ============================================
create table if not exists public.user_roadmap_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  step_id uuid not null references public.roadmap_steps(id) on delete cascade,
  completed_at timestamptz default now(),
  unique(user_id, step_id)
);

-- ============================================
-- PRACTICE PROBLEMS
-- ============================================
create table if not exists public.practice_problems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  points integer not null default 10,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================
-- USER PROBLEM PROGRESS (solved problems)
-- ============================================
create table if not exists public.user_problem_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  problem_id uuid not null references public.practice_problems(id) on delete cascade,
  points_earned integer not null,
  solved_at timestamptz default now(),
  unique(user_id, problem_id)
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_iq_test_results_user on public.iq_test_results(user_id);
create index if not exists idx_learning_progress_user on public.user_learning_progress(user_id);
create index if not exists idx_roadmap_progress_user on public.user_roadmap_progress(user_id);
create index if not exists idx_user_problem_progress_user on public.user_problem_progress(user_id);
create index if not exists idx_learning_modules_level on public.learning_modules(level);
create index if not exists idx_roadmap_steps_level on public.roadmap_steps(level);

-- ============================================
-- TRIGGER: Create profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public.profiles enable row level security;
alter table public.iq_test_results enable row level security;
alter table public.learning_modules enable row level security;
alter table public.user_learning_progress enable row level security;
alter table public.roadmap_steps enable row level security;
alter table public.user_roadmap_progress enable row level security;
alter table public.practice_problems enable row level security;
alter table public.user_problem_progress enable row level security;

-- Profiles: users can read/update own
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
-- Leaderboard: anyone can read profiles (for display name, points, etc.)
create policy "Profiles are readable for leaderboard" on public.profiles for select using (true);

-- IQ test results: own only
create policy "Users can view own iq results" on public.iq_test_results for select using (auth.uid() = user_id);
create policy "Users can insert own iq results" on public.iq_test_results for insert with check (auth.uid() = user_id);

-- Learning modules: everyone can read
create policy "Learning modules are readable" on public.learning_modules for select using (true);

-- User learning progress: own only
create policy "Users can view own learning progress" on public.user_learning_progress for select using (auth.uid() = user_id);
create policy "Users can insert own learning progress" on public.user_learning_progress for insert with check (auth.uid() = user_id);
create policy "Users can delete own learning progress" on public.user_learning_progress for delete using (auth.uid() = user_id);

-- Roadmap steps: everyone can read
create policy "Roadmap steps are readable" on public.roadmap_steps for select using (true);

-- User roadmap progress: own only
create policy "Users can view own roadmap progress" on public.user_roadmap_progress for select using (auth.uid() = user_id);
create policy "Users can insert own roadmap progress" on public.user_roadmap_progress for insert with check (auth.uid() = user_id);
create policy "Users can delete own roadmap progress" on public.user_roadmap_progress for delete using (auth.uid() = user_id);

-- Practice problems: everyone can read
create policy "Practice problems are readable" on public.practice_problems for select using (true);

-- User problem progress: own only
create policy "Users can view own problem progress" on public.user_problem_progress for select using (auth.uid() = user_id);
create policy "Users can insert own problem progress" on public.user_problem_progress for insert with check (auth.uid() = user_id);

-- ============================================
-- SEED: Learning modules (sample by level)
-- ============================================
insert into public.learning_modules (title, description, video_url, level, sort_order) values
  ('Intro to Programming', 'Get started with variables and logic', 'https://www.youtube.com/embed/rfscVS0vtbw', 'Beginner', 1),
  ('Variables and Data Types', 'Understanding strings, numbers, and booleans', 'https://www.youtube.com/embed/khKv-8q7YmY', 'Beginner', 2),
  ('Control Flow', 'If statements and loops', 'https://www.youtube.com/embed/DZwmZ8Usvnk', 'Beginner', 3),
  ('Functions Basics', 'Writing and calling functions', 'https://www.youtube.com/embed/8Dvy7WYnx1s', 'Beginner', 4),
  ('Arrays and Objects', 'Collections and key-value pairs', 'https://www.youtube.com/embed/8Dvy7WYnx1s', 'Beginner', 5),
  ('Intermediate Concepts', 'Closures and scope', 'https://www.youtube.com/embed/8Dvy7WYnx1s', 'Intermediate', 1),
  ('Async and Promises', 'Working with asynchronous code', 'https://www.youtube.com/embed/8Dvy7WYnx1s', 'Intermediate', 2),
  ('Data Structures', 'Lists, stacks, and queues', 'https://www.youtube.com/embed/8Dvy7WYnx1s', 'Intermediate', 3),
  ('Algorithms Intro', 'Sorting and searching', 'https://www.youtube.com/embed/8Dvy7WYnx1s', 'Intermediate', 4),
  ('Advanced Patterns', 'Design patterns and architecture', 'https://www.youtube.com/embed/8Dvy7WYnx1s', 'Advanced', 1),
  ('System Design Basics', 'Scaling and distributed systems', 'https://www.youtube.com/embed/8Dvy7WYnx1s', 'Advanced', 2)
;

-- ============================================
-- SEED: Roadmap steps (sample by level)
-- ============================================
insert into public.roadmap_steps (title, description, level, sort_order, resource_links) values
  ('Setup your environment', 'Install a code editor and runtime', 'Beginner', 1, '[{"label": "VS Code", "url": "https://code.visualstudio.com/"}]'),
  ('First program', 'Write and run Hello World', 'Beginner', 2, '[]'),
  ('Learn variables', 'Practice with variables and types', 'Beginner', 3, '[]'),
  ('Conditionals and loops', 'Master if/else and for/while', 'Beginner', 4, '[]'),
  ('Functions', 'Write reusable functions', 'Beginner', 5, '[]'),
  ('Data structures', 'Learn arrays, maps, sets', 'Intermediate', 1, '[]'),
  ('Basic algorithms', 'Sorting and simple algorithms', 'Intermediate', 2, '[]'),
  ('Problem solving', 'Solve 20 practice problems', 'Intermediate', 3, '[]'),
  ('Projects', 'Build a small project', 'Intermediate', 4, '[]'),
  ('Advanced algorithms', 'Graphs, DP, advanced topics', 'Advanced', 1, '[]'),
  ('System design', 'Design a scalable system', 'Advanced', 2, '[]')
;

-- ============================================
-- SEED: Practice problems
-- ============================================
insert into public.practice_problems (title, description, difficulty, points, sort_order) values
  ('Sum of Two Numbers', 'Given two numbers a and b, return their sum.', 'Easy', 10, 1),
  ('Maximum of Array', 'Find the maximum value in an array of integers.', 'Easy', 10, 2),
  ('FizzBuzz', 'Print Fizz for multiples of 3, Buzz for 5, FizzBuzz for both.', 'Easy', 15, 3),
  ('Reverse String', 'Reverse a given string without using built-in reverse.', 'Easy', 10, 4),
  ('Palindrome Check', 'Determine if a string is a palindrome.', 'Easy', 15, 5),
  ('Two Sum', 'Find two indices such that their values add up to target.', 'Medium', 20, 6),
  ('Valid Parentheses', 'Check if a string of brackets is valid.', 'Medium', 20, 7),
  ('Merge Sorted Arrays', 'Merge two sorted arrays into one sorted array.', 'Medium', 25, 8),
  ('Longest Substring', 'Find length of longest substring without repeating characters.', 'Medium', 25, 9),
  ('Binary Search', 'Implement binary search on a sorted array.', 'Medium', 20, 10),
  ('LRU Cache', 'Implement a least recently used cache.', 'Hard', 40, 11),
  ('Trapping Rain Water', 'Compute how much water can be trapped between bars.', 'Hard', 40, 12)
;
