import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user, profile, updateProfile, refreshProfile } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [iqHistory, setIqHistory] = useState([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setDisplayName(profile?.display_name || '')
  }, [profile])

  useEffect(() => {
    if (!user) return
    supabase
      .from('iq_test_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setIqHistory(data || []))
  }, [user])

  async function handleSaveName() {
    setSaving(true)
    setMessage('')
    const { error } = await updateProfile({ display_name: displayName || null, updated_at: new Date().toISOString() })
    setSaving(false)
    if (error) setMessage(error.message)
    else setMessage('Saved.')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-10"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile</h1>
        <p className="mt-1 text-slate-400 text-sm sm:text-base">Your details and progress</p>
      </div>

      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 sm:p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white">Account</h2>
        <p className="text-slate-400 text-sm break-all">{user?.email}</p>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Display name</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white"
              placeholder="Your name"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveName}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium disabled:opacity-50 min-h-[44px] shrink-0"
            >
              {saving ? 'Saving...' : 'Save'}
            </motion.button>
          </div>
          {message && <p className="mt-2 text-sm text-slate-400">{message}</p>}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-slate-400 text-sm">Level</p>
            <p className="text-xl font-semibold text-indigo-400">{profile?.learning_level || 'Beginner'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Points</p>
            <p className="text-xl font-semibold text-white">{profile?.points ?? 0}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Problems solved</p>
            <p className="text-xl font-semibold text-white">{profile?.problems_solved ?? 0}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Streak</p>
            <p className="text-xl font-semibold text-amber-400">🔥 {profile?.current_streak ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-white mb-4">IQ Test history</h2>
        {iqHistory.length === 0 ? (
          <p className="text-slate-400">No tests taken yet.</p>
        ) : (
          <ul className="space-y-3">
            {iqHistory.map((r) => (
              <li key={r.id} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                <span className="text-slate-300">
                  {r.score}/{r.total_questions} — {r.level_assigned}
                </span>
                <span className="text-slate-500 text-sm">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}
