import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Roadmap() {
  const { user, profile } = useAuth()
  const level = profile?.learning_level || 'Beginner'
  const [steps, setSteps] = useState([])
  const [completedIds, setCompletedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSteps()
    if (user) loadProgress()
  }, [level, user])

  async function loadSteps() {
    const { data } = await supabase
      .from('roadmap_steps')
      .select('*')
      .eq('level', level)
      .order('sort_order')
    setSteps(data || [])
    setLoading(false)
  }

  async function loadProgress() {
    if (!user) return
    const { data } = await supabase
      .from('user_roadmap_progress')
      .select('step_id')
      .eq('user_id', user.id)
    setCompletedIds(new Set((data || []).map((r) => r.step_id)))
  }

  async function toggleComplete(stepId) {
    if (!user) return
    const isCompleted = completedIds.has(stepId)
    if (isCompleted) {
      await supabase
        .from('user_roadmap_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('step_id', stepId)
      setCompletedIds((prev) => {
        const next = new Set(prev)
        next.delete(stepId)
        return next
      })
    } else {
      await supabase.from('user_roadmap_progress').insert({
        user_id: user.id,
        step_id: stepId,
      })
      setCompletedIds((prev) => new Set([...prev, stepId]))
    }
  }

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
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Roadmap</h1>
        <p className="mt-1 text-slate-400 text-sm sm:text-base">Your path for level: <span className="text-indigo-400">{level}</span></p>
      </div>

      <div className="relative">
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-slate-700" />
        <ul className="space-y-4 sm:space-y-6">
          {steps.map((step, i) => {
            const links = Array.isArray(step.resource_links) ? step.resource_links : (step.resource_links ? JSON.parse(step.resource_links) : [])
            const completed = completedIds.has(step.id)
            return (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-12 sm:pl-16"
              >
                <div className={`absolute left-2 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ${
                  completed ? 'bg-green-500 border-green-500' : 'bg-slate-800 border-slate-600'
                }`}>
                  {completed && <span className="text-white text-[10px] sm:text-xs">✓</span>}
                </div>
                <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-white">{step.title}</h2>
                      {step.description && <p className="mt-2 text-slate-400 text-sm">{step.description}</p>}
                      {links.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {links.map((link, j) => (
                            <a
                              key={j}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 text-sm"
                            >
                              {link.label} →
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    {user && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleComplete(step.id)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium min-h-[44px] shrink-0 ${
                          completed ? 'bg-green-600/20 text-green-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {completed ? 'Done' : 'Mark done'}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>

      {steps.length === 0 && (
        <p className="text-slate-400 text-center py-12">No roadmap steps for your level. Complete the IQ test first.</p>
      )}
    </motion.div>
  )
}
