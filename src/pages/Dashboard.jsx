import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const cards = [
  { to: '/iq-test', label: 'IQ Test', desc: 'Assess your level', icon: '🧠', color: 'from-violet-500 to-purple-600' },
  { to: '/learning', label: 'Learning Hub', desc: 'Videos & guides', icon: '📚', color: 'from-blue-500 to-cyan-500' },
  { to: '/roadmap', label: 'Roadmap', desc: 'Your learning path', icon: '🗺️', color: 'from-emerald-500 to-teal-500' },
  { to: '/practice', label: 'Coding Practice', desc: 'Problems & points', icon: '💻', color: 'from-amber-500 to-orange-500' },
  { to: '/profile', label: 'Profile', desc: 'Settings & stats', icon: '👤', color: 'from-pink-500 to-rose-500' },
  { to: '/leaderboard', label: 'Leaderboard', desc: 'Rankings', icon: '🏆', color: 'from-yellow-500 to-amber-500' },
]

export default function Dashboard() {
  const { profile } = useAuth()
  const level = profile?.learning_level || 'Beginner'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 sm:space-y-10"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base">
          Your current learning level: <span className="text-indigo-400 font-semibold">{level}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={card.to} className="block">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg hover:shadow-xl transition-shadow cursor-pointer min-h-[120px] flex flex-col justify-center`}
              >
                <span className="text-3xl sm:text-4xl">{card.icon}</span>
                <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-white">{card.label}</h2>
                <p className="mt-1 text-white/80 text-sm">{card.desc}</p>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
