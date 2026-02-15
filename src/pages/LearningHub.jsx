import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function LearningHub() {
  const { user, profile } = useAuth()
  const level = profile?.learning_level || 'Beginner'
  const [modules, setModules] = useState([])
  const [completedIds, setCompletedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadModules()
    loadProgress()
  }, [level])

  async function loadModules() {
    const { data } = await supabase
      .from('learning_modules')
      .select('*')
      .eq('level', level)
      .order('sort_order')
    setModules(data || [])
    setLoading(false)
  }

  async function loadProgress() {
    if (!user) return
    const { data } = await supabase
      .from('user_learning_progress')
      .select('module_id')
      .eq('user_id', user.id)
    setCompletedIds(new Set((data || []).map((r) => r.module_id)))
  }

  async function toggleComplete(moduleId) {
    if (!user) return
    const isCompleted = completedIds.has(moduleId)
    if (isCompleted) {
      await supabase
        .from('user_learning_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
      setCompletedIds((prev) => {
        const next = new Set(prev)
        next.delete(moduleId)
        return next
      })
    } else {
      await supabase.from('user_learning_progress').insert({
        user_id: user.id,
        module_id: moduleId,
      })
      setCompletedIds((prev) => new Set([...prev, moduleId]))
    }
  }

  const total = modules.length
  const completed = completedIds.size
  const progressPct = total ? Math.round((completed / total) * 100) : 0

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
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Learning Hub</h1>
        <p className="mt-1 text-slate-400 text-sm sm:text-base">Content for level: <span className="text-indigo-400">{level}</span></p>
      </div>

      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 sm:p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400">Progress</span>
          <span className="text-white font-semibold">{completed} / {total} completed ({progressPct}%)</span>
        </div>
        <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6 }}
            className="h-full bg-indigo-500 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-white">{mod.title}</h2>
              {mod.description && <p className="mt-1 text-slate-400 text-sm">{mod.description}</p>}
              {mod.video_url && (
                <div className="mt-4 aspect-video w-full max-w-xl rounded-lg overflow-hidden bg-black">
                  <iframe
                    title={mod.title}
                    src={mod.video_url}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleComplete(mod.id)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-colors min-h-[44px] ${
                  completedIds.has(mod.id)
                    ? 'bg-green-600/20 text-green-400 border border-green-500/50'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                }`}
              >
                {completedIds.has(mod.id) ? 'Completed' : 'Mark complete'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {modules.length === 0 && (
        <p className="text-slate-400 text-center py-12">No modules for your level yet. Take the IQ test to get a level.</p>
      )}
    </motion.div>
  )
}
