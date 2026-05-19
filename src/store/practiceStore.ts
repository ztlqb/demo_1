import { create } from 'zustand'
import type { Question, OptionKey, AnswerResult } from '@/types'
import { useWrongStore } from './wrongStore'
import { loadFromStorage, saveToStorage, removeFromStorage, STORAGE_KEY_PRACTICE } from '@/utils/storage'

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
  hasUnfinished: () => boolean
  getStats: () => { total: number; correct: number; wrong: number; unanswered: number; accuracy: string }
}

function saveStateToStorage(state: Partial<PracticeState>) {
  saveToStorage(STORAGE_KEY_PRACTICE, {
    questions: state.questions,
    currentIndex: state.currentIndex,
    answers: state.answers,
    results: state.results,
    isWrongPractice: state.isWrongPractice,
  })
}

export const usePracticeStore = create<PracticeState>((set, get) => {
  const saved = loadFromStorage<Partial<PracticeState>>(STORAGE_KEY_PRACTICE, {})

  return {
    questions: saved.questions || [],
    currentIndex: saved.currentIndex || 0,
    answers: saved.answers || {},
    results: saved.results || {},
    isWrongPractice: saved.isWrongPractice || false,

    startPractice: (questions: Question[], isWrong = false) => {
      const state = { questions, currentIndex: 0, answers: {}, results: {}, isWrongPractice: isWrong }
      set(state)
      saveStateToStorage(state)
    },

    selectAnswer: (id: string, answer: OptionKey) => {
      const results = get().results
      if (results[id]) return
      const newAnswers = { ...get().answers, [id]: [answer] }
      const state = { answers: newAnswers }
      set(state)
      saveStateToStorage({ ...get(), ...state })
    },

    toggleAnswer: (id: string, answer: OptionKey) => {
      const results = get().results
      if (results[id]) return
      const current = get().answers[id] || []
      const newAnswers = current.includes(answer)
        ? current.filter(a => a !== answer)
        : [...current, answer].sort()
      const state = { answers: { ...get().answers, [id]: newAnswers } }
      set(state)
      saveStateToStorage({ ...get(), ...state })
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
      const state = { results: newResults }
      set(state)
      saveStateToStorage({ ...get(), ...state })
      if (!isCorrect) {
        useWrongStore.getState().addWrongQuestion({ ...question, wrongAnswer: userAnswer, addedAt: Date.now() })
      } else if (isWrongPractice) {
        useWrongStore.getState().removeWrongQuestion(id)
      }
    },

    nextQuestion: () => {
      const { currentIndex, questions } = get()
      if (currentIndex < questions.length - 1) {
        const state = { currentIndex: currentIndex + 1 }
        set(state)
        saveStateToStorage({ ...get(), ...state })
      }
    },

    prevQuestion: () => {
      const { currentIndex } = get()
      if (currentIndex > 0) {
        const state = { currentIndex: currentIndex - 1 }
        set(state)
        saveStateToStorage({ ...get(), ...state })
      }
    },

    goToQuestion: (index: number) => {
      const { questions } = get()
      if (index >= 0 && index < questions.length) {
        const state = { currentIndex: index }
        set(state)
        saveStateToStorage({ ...get(), ...state })
      }
    },

    resetPractice: () => {
      const state = { questions: [], currentIndex: 0, answers: {}, results: {}, isWrongPractice: false }
      set(state)
      removeFromStorage(STORAGE_KEY_PRACTICE)
    },

    isFinished: () => {
      const { questions, results } = get()
      return questions.length > 0 && questions.every(q => results[q.id])
    },

    hasUnfinished: () => {
      const { questions, results } = get()
      return questions.length > 0 && !questions.every(q => results[q.id])
    },

    getStats: () => {
      const { questions, results } = get()
      const total = questions.length
      let correct = 0, wrong = 0, unanswered = 0
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
  }
})
