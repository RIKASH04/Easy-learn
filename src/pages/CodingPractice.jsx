import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const DIFFICULTY_COLOR = { Easy: 'text-green-400', Medium: 'text-amber-400', Hard: 'text-red-400' }

export default function CodingPractice() {
  const { user, profile, refreshProfile } = useAuth()
  const [problems, setProblems] = useState([])
  const [solvedIds, setSolvedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [solving, setSolving] = useState(null)

  useEffect(() => {
    loadProblems()
    if (user) loadProgress()
  }, [user])

  async function loadProblems() {
    const { data } = await supabase
      .from('practice_problems')
      .select('*')
      .order('sort_order')
    setProblems(data || [])
    setLoading(false)
  }

  async function loadProgress() {
    if (!user) return
    const { data } = await supabase
      .from('user_problem_progress')
      .select('problem_id')
      .eq('user_id', user.id)
    setSolvedIds(new Set((data || []).map((r) => r.problem_id)))
  }

  async function markSolved(problem) {
    if (!user || solvedIds.has(problem.id)) return
    setSolving(problem.id)
    const points = problem.points || 10

    await supabase.from('user_problem_progress').insert({
      user_id: user.id,
      problem_id: problem.id,
      points_earned: points,
    })

    const today = new Date().toISOString().slice(0, 10)
    const last = profile?.last_activity_date
    let newStreak = profile?.current_streak || 0
    let newLongest = profile?.longest_streak || 0
    if (!last) {
      newStreak = 1
    } else {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().slice(0, 10)
      if (last === yesterdayStr) newStreak = (profile?.current_streak || 0) + 1
      else if (last !== today) newStreak = 1
    }
    if (newStreak > (profile?.longest_streak || 0)) newLongest = newStreak

    await supabase
      .from('profiles')
      .update({
        points: (profile?.points || 0) + points,
        problems_solved: (profile?.problems_solved || 0) + 1,
        current_streak: newStreak,
        longest_streak: newLongest,
        last_activity_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    await refreshProfile()
    setSolvedIds((prev) => new Set([...prev, problem.id]))
    setSolving(null)
  }

  const totalPoints = profile?.points || 0
  const totalSolved = profile?.problems_solved || 0
  const streak = profile?.current_streak || 0
  const badge = totalSolved >= 10 ? 'Advanced' : totalSolved >= 5 ? 'Intermediate' : 'Beginner'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-8"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Coding Practice</h1>
        <p className="mt-1 text-slate-400 text-sm sm:text-base">Solve problems, earn points, climb the leaderboard.</p>
      </div>

      {user && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-3 sm:p-4">
            <p className="text-slate-400 text-xs sm:text-sm">Points</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalPoints}</p>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-3 sm:p-4">
            <p className="text-slate-400 text-xs sm:text-sm">Solved</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalSolved}</p>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-3 sm:p-4">
            <p className="text-slate-400 text-xs sm:text-sm">Streak</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-400">🔥 {streak}</p>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-3 sm:p-4">
            <p className="text-slate-400 text-xs sm:text-sm">Badge</p>
            <p className="text-base sm:text-lg font-bold text-indigo-400">{badge}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {problems.map((problem, i) => {
          const solved = solvedIds.has(problem.id)
          return (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <h2 className="text-base sm:text-lg font-semibold text-white">{problem.title}</h2>
                  <span className={`text-xs sm:text-sm font-medium ${DIFFICULTY_COLOR[problem.difficulty] || 'text-slate-400'}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-slate-500 text-xs sm:text-sm">{problem.points} pts</span>
                </div>
                <p className="mt-2 text-slate-400 text-sm line-clamp-2 sm:line-clamp-none">{problem.description}</p>
              </div>
              {user && (
                <motion.button
                  whileHover={!solved ? { scale: 1.05 } : {}}
                  whileTap={!solved ? { scale: 0.98 } : {}}
                  onClick={() => markSolved(problem)}
                  disabled={solved || solving === problem.id}
                  className={`px-4 py-2.5 rounded-lg font-medium shrink-0 min-h-[44px] ${
                    solved
                      ? 'bg-green-600/20 text-green-400 border border-green-500/50 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {solving === problem.id ? '...' : solved ? 'Solved ✓' : 'Mark solved'}
                </motion.button>
              )}
            </motion.div>
          )
        })}
      </div>

      {!user && (
        <p className="text-slate-400 text-center py-8">Sign in to track your progress and earn points.</p>
      )}
    </motion.div>
  )
}
