import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/iq-test', label: 'IQ Test' },
  { to: '/learning', label: 'Learning Hub' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/practice', label: 'Coding Practice' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/profile', label: 'Profile' },
]

export function Layout({ children }) {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleLogout() {
    const { supabase } = await import('../lib/supabase')
    await supabase.auth.signOut()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const showDashboardNav = !!user

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700/50 pt-[env(safe-area-inset-top,0)]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 shrink-0" onClick={() => setMobileMenuOpen(false)}>
              <motion.span
                className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                Easy Learn
              </motion.span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {showDashboardNav && navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/leaderboard"
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm font-medium transition-colors"
              >
                Leaderboard
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {user ? (
                <>
                  <span className="text-slate-400 text-sm hidden sm:inline truncate max-w-[120px]">
                    {profile?.display_name || user?.email?.split('@')[0]}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="px-3 sm:px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    Logout
                  </motion.button>
                  <motion.button
                    type="button"
                    aria-label="Toggle menu"
                    onClick={() => setMobileMenuOpen((o) => !o)}
                    className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    {mobileMenuOpen ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/leaderboard" className="md:hidden px-3 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium min-h-[44px] flex items-center">Leaderboard</Link>
                  <Link to="/login" className="px-3 sm:px-4 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium min-h-[44px] flex items-center">Login</Link>
                  <Link to="/signup" className="px-3 sm:px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium min-h-[44px] flex items-center">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-700/50 bg-slate-900/98 overflow-hidden"
            >
              <div className="py-3 px-4 flex flex-col gap-1">
                {showDashboardNav && navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm font-medium min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm font-medium min-h-[44px] flex items-center"
                >
                  Leaderboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-safe">
        {children}
      </main>
    </div>
  )
}
