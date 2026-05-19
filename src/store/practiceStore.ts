import { create } from 'zustand'
import type { Question, OptionKey, AnswerResult } from '@/types'
import { useWrongStore } from './wrongStore'

interface PracticeState {
  questions: Question[]
  currentIndex: number
  answers: Record<string, string[]>
  results: Record<string, AnswerResult>
  isWrongPractice: boolean
  startPractice: (questions: Question[], isWrong?: boolean) => void
  toggleAnswer: (id: string, answer: OptionKey) => void
  selectAnswer: (id: string, answer: OptionKey) => void
  submitAnswer: (id: string) => void
  nextQuestion: () => void
  prevQuestion: () => void
  goToQuestion: (index: number) => void
  resetPractice: () => void
  isFinished: () => boolean
  getStats: () => { total: number; correct: number; wrong: number; unanswered: number; accuracy: string }
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  answers: {},
  results: {},
  isWrongPractice: false,

  startPractice: (questions: Question[], isWrong = false) => {
    set({
      questions,
      currentIndex: 0,
      answers: {},
      results: {},
      isWrongPractice: isWrong,
    })
  },

  selectAnswer: (id: string, answer: OptionKey) => {
    const results = get().results
    if (results[id]) return
    set({ answers: { ...get().answers, [id]: [answer] } })
  },

  toggleAnswer: (id: string, answer: OptionKey) => {
    const results = get().results
    if (results[id]) return
    const current = get().answers[id] || []
    const newAnswers = current.includes(answer)
      ? current.filter(a => a !== answer)
      : [...current, answer].sort()
    set({ answers: { ...get().answers, [id]: newAnswers } })
  },

  submitAnswer: (id: string) => {
    const { answers, questions, results, isWrongPractice } = get()
    if (results[id]) return

    const question = questions.find(q => q.id === id)
    const selectedAnswers = answers[id]
    if (!question || !selectedAnswers || selectedAnswers.length === 0) return

    const userAnswer = selectedAnswers.sort().join('')
    const correctAnswer = question.answer.split('').sort().join('')
    const isCorrect = userAnswer === correctAnswer

    const newResults = { ...results, [id]: isCorrect ? 'correct' as const : 'wrong' as const }
    set({ results: newResults })

    if (!isCorrect) {
      useWrongStore.getState().addWrongQuestion({
        ...question,
        wrongAnswer: userAnswer,
        addedAt: Date.now(),
      })
    } else if (isWrongPractice) {
      useWrongStore.getState().removeWrongQuestion(id)
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get()
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 })
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get()
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 })
    }
  },

  goToQuestion: (index: number) => {
    const { questions } = get()
    if (index >= 0 && index < questions.length) {
      set({ currentIndex: index })
    }
  },

  resetPractice: () => {
    set({
      questions: [],
      currentIndex: 0,
      answers: {},
      results: {},
      isWrongPractice: false,
    })
  },

  isFinished: () => {
    const { questions, results } = get()
    return questions.length > 0 && questions.every(q => results[q.id])
  },

  getStats: () => {
    const { questions, results } = get()
    const total = questions.length
    let correct = 0
    let wrong = 0
    let unanswered = 0
    for (const q of questions) {
      const r = results[q.id]
      if (r === 'correct') correct++
      else if (r === 'wrong') wrong++
      else unanswered++
    }
    const answered = correct + wrong
    const accuracy = answered > 0 ? ((correct / answered) * 100).toFixed(1) : '0.0'
    return { total, correct, wrong, unanswered, accuracy }
  },
}))
