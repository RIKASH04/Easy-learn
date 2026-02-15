export const IQ_QUESTIONS = [
  {
    id: 'q1',
    question: 'What is the next number in the sequence: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '36'],
    correctIndex: 1,
  },
  {
    id: 'q2',
    question: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.',
    options: ['True', 'False', 'Cannot be determined', 'None'],
    correctIndex: 0,
  },
  {
    id: 'q3',
    question: 'Which word does not belong: Apple, Banana, Carrot, Mango?',
    options: ['Apple', 'Banana', 'Carrot', 'Mango'],
    correctIndex: 2,
  },
  {
    id: 'q4',
    question: 'A bat and ball cost $1.10 total. The bat costs $1.00 more than the ball. How much does the ball cost?',
    options: ['$0.05', '$0.10', '$0.15', '$0.20'],
    correctIndex: 0,
  },
  {
    id: 'q5',
    question: 'Complete the pattern: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '12', '13', '14'],
    correctIndex: 2,
  },
]

export function getLevelFromScore(score, total = 5) {
  const pct = (score / total) * 100
  if (pct >= 80) return 'Advanced'
  if (pct >= 50) return 'Intermediate'
  return 'Beginner'
}
