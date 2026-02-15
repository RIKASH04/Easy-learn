import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Leaderboard() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  async function loadLeaderboard() {
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, learning_level, points, problems_solved')
      .order('points', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  const currentUserId = user?.id

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
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Leaderboard</h1>
        <p className="mt-1 text-slate-400 text-sm sm:text-base">Ranked by total points. Everyone can view.</p>
      </div>

      {/* Mobile: card layout */}
      <div className="md:hidden space-y-3">
        {rows.map((row, index) => {
          const rank = index + 1
          const isCurrentUser = row.id === currentUserId
          return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`rounded-xl p-4 border ${isCurrentUser ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/50 border-slate-700/50'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-lg font-bold shrink-0 ${rank <= 3 ? 'text-amber-400' : 'text-slate-300'}`}>
                    #{rank}
                  </span>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">
                      {row.display_name || 'Anonymous'}
                      {isCurrentUser && <span className="text-indigo-400 text-sm ml-1">(you)</span>}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {row.learning_level || 'Beginner'} · {row.points ?? 0} pts · {row.problems_solved ?? 0} solved
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Rank</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Name</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Level</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Points</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Solved</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const rank = index + 1
                const isCurrentUser = row.id === currentUserId
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`border-b border-slate-700/50 ${isCurrentUser ? 'bg-indigo-500/10' : ''}`}
                  >
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${rank <= 3 ? 'text-amber-400' : 'text-slate-300'}`}>
                        #{rank}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white font-medium">
                      {row.display_name || 'Anonymous'}
                      {isCurrentUser && <span className="ml-2 text-indigo-400 text-sm">(you)</span>}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded text-sm bg-slate-700 text-slate-300">
                        {row.learning_level || 'Beginner'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white">{row.points ?? 0}</td>
                    <td className="py-4 px-6 text-slate-400">{row.problems_solved ?? 0}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {rows.length === 0 && (
        <p className="text-slate-400 text-center py-12">No entries yet. Solve problems to appear here.</p>
      )}
    </motion.div>
  )
}
