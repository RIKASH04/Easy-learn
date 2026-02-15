import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  {
    title: 'IQ Assessment',
    description: 'Take a short assessment to get a personalized learning level and content.',
    icon: '🧠',
  },
  {
    title: 'Learning Hub',
    description: 'Curated videos and guides tailored to your level with progress tracking.',
    icon: '📚',
  },
  {
    title: 'Structured Roadmap',
    description: 'Follow a clear path with steps, resources, and completion tracking.',
    icon: '🗺️',
  },
  {
    title: 'Coding Practice',
    description: 'Solve problems, earn points, build streaks, and climb the leaderboard.',
    icon: '💻',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between gap-3">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent shrink-0"
        >
          Easy Learn
        </motion.span>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Link to="/leaderboard" className="text-slate-300 hover:text-white text-sm font-medium py-2 px-2 sm:px-4 min-h-[44px] flex items-center">
            Leaderboard
          </Link>
          <Link to="/login" className="py-2 px-3 sm:px-4 rounded-lg text-slate-300 hover:text-white text-sm font-medium min-h-[44px] flex items-center">
            Login
          </Link>
          <Link
            to="/signup"
            className="py-2 px-3 sm:px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors min-h-[44px] flex items-center"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto px-1"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Learn smarter, not harder.
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-1">
            Get a personalized level, follow a roadmap, practice coding, and track your progress—all in one place.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-colors min-h-[48px]"
              >
                Get Started
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors min-h-[48px]"
              >
                Login
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 border-t border-slate-700/50">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16 px-2"
        >
          Everything you need to level up
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-5 sm:p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-colors"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 border-t border-slate-700/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center p-6 sm:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20"
        >
          <h2 className="text-xl sm:text-2xl font-bold">Ready to start?</h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">Create an account and take the IQ test to get your level.</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors min-h-[48px] flex items-center justify-center"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors min-h-[48px] flex items-center justify-center"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="max-w-7xl mx-auto px-4 py-6 sm:py-8 border-t border-slate-700/50 text-center text-slate-500 text-sm pb-safe">
        Easy Learn © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
