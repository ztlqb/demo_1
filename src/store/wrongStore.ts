import { create } from 'zustand'
import type { WrongQuestion } from '@/types'
import { loadFromStorage, saveToStorage, removeFromStorage, STORAGE_KEY_WRONG } from '@/utils/storage'

interface WrongState {
  wrongQuestions: WrongQuestion[]
  addWrongQuestion: (q: WrongQuestion) => void
  removeWrongQuestion: (id: string) => void
  clearWrongQuestions: () => void
  restoreFromStorage: () => void
}

export const useWrongStore = create<WrongState>((set, get) => ({
  wrongQuestions: [],

  addWrongQuestion: (q: WrongQuestion) => {
    const existing = get().wrongQuestions.find(w => w.id === q.id)
    if (existing) {
      const updated = get().wrongQuestions.map(w => w.id === q.id ? { ...w, wrongAnswer: q.wrongAnswer, addedAt: q.addedAt } : w)
      set({ wrongQuestions: updated })
      saveToStorage(STORAGE_KEY_WRONG, updated)
    } else {
      const updated = [...get().wrongQuestions, q]
      set({ wrongQuestions: updated })
      saveToStorage(STORAGE_KEY_WRONG, updated)
    }
  },

  removeWrongQuestion: (id: string) => {
    const updated = get().wrongQuestions.filter(w => w.id !== id)
    set({ wrongQuestions: updated })
    saveToStorage(STORAGE_KEY_WRONG, updated)
  },

  clearWrongQuestions: () => {
    set({ wrongQuestions: [] })
    removeFromStorage(STORAGE_KEY_WRONG)
  },

  restoreFromStorage: () => {
    const wrongQuestions = loadFromStorage<WrongQuestion[]>(STORAGE_KEY_WRONG, [])
    set({ wrongQuestions })
  },
}))
