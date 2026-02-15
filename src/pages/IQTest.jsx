import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { IQ_QUESTIONS, getLevelFromScore } from '../data/iqQuestions'

export default function IQTest() {
  const { user, profile, refreshProfile } = useAuth()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const currentQuestion = IQ_QUESTIONS[step]
  const isLast = step === IQ_QUESTIONS.length - 1

  function handleSelect(optionIndex) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }))
  }

  function handleNext() {
    if (isLast) {
      submitTest()
    } else {
      setStep((s) => s + 1)
    }
  }

  async function submitTest() {
    setLoading(true)
    let score = 0
    IQ_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctIndex) score++
    })
    const level = getLevelFromScore(score, IQ_QUESTIONS.length)

    const { error: insertError } = await supabase.from('iq_test_results').insert({
      user_id: user.id,
      score,
      total_questions: IQ_QUESTIONS.length,
      level_assigned: level,
    })
    if (insertError) {
      setLoading(false)
      setResult({ error: insertError.message })
      return
    }

    await supabase
      .from('profiles')
      .update({ learning_level: level, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    await refreshProfile()
    setResult({ score, total: IQ_QUESTIONS.length, level })
    setLoading(false)
  }

  if (result && !result.error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center"
      >
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-8">
          <h1 className="text-2xl font-bold text-white">IQ Test Complete</h1>
          <p className="mt-4 text-4xl font-bold text-indigo-400">
            {result.score} / {result.total}
          </p>
          <p className="mt-2 text-slate-400">Your level: <span className="text-white font-semibold">{result.level}</span></p>
          <p className="mt-4 text-slate-400 text-sm">
            This level will tailor your Learning Hub and Roadmap content.
          </p>
        </div>
      </motion.div>
    )
  }

  if (result?.error) {
    return (
      <div className="max-w-lg mx-auto text-center p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
        {result.error}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-1"
    >
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">IQ Test</h1>
      <p className="text-slate-400 text-sm mb-6 sm:mb-8">Answer 5 questions. Your score will set your learning level.</p>

      <div className="mb-4 sm:mb-6 flex gap-1.5 sm:gap-2">
        {IQ_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-indigo-500' : 'bg-slate-700'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 sm:p-8"
        >
          <h2 className="text-base sm:text-lg font-semibold text-white">{currentQuestion.question}</h2>
          <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            {currentQuestion.options.map((opt, idx) => (
              <li key={idx}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-colors min-h-[48px] ${
                    answers[currentQuestion.id] === idx
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {opt}
                </motion.button>
              </li>
            ))}
          </ul>
          <div className="mt-6 sm:mt-8 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={answers[currentQuestion.id] === undefined || loading}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium disabled:opacity-50 min-h-[44px]"
            >
              {loading ? 'Submitting...' : isLast ? 'Submit' : 'Next'}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
