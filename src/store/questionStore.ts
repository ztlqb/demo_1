import { create } from 'zustand'
import type { Question } from '@/types'
import builtinQuestions from '@/data/builtinQuestions.json'
import { loadFromStorage, saveToStorage, removeFromStorage, STORAGE_KEY_QUESTIONS, STORAGE_KEY_FILENAME } from '@/utils/storage'

interface QuestionState {
  questions: Question[]
  filename: string
  isLoading: boolean
  error: string | null
  loadFromFile: (file: File) => Promise<void>
  clearQuestions: () => void
  getRandomQuestions: (count: number) => Question[]
  restoreFromStorage: () => void
  loadBuiltin: () => void
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  filename: '',
  isLoading: false,
  error: null,

  loadBuiltin: () => {
    const questions = builtinQuestions as Question[]
    set({ questions, filename: '新分人员考试题库' })
    saveToStorage(STORAGE_KEY_QUESTIONS, questions)
    saveToStorage(STORAGE_KEY_FILENAME, '新分人员考试题库')
  },

  loadFromFile: async (file: File) => {
    set({ isLoading: true, error: null })
    try {
      const { parseExcelFile } = await import('@/utils/excelParser')
      const result = await parseExcelFile(file)
      set({ questions: result.questions, filename: result.filename, isLoading: false })
      saveToStorage(STORAGE_KEY_QUESTIONS, result.questions)
      saveToStorage(STORAGE_KEY_FILENAME, result.filename)
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '解析失败', isLoading: false })
    }
  },

  clearQuestions: () => {
    set({ questions: [], filename: '', error: null })
    removeFromStorage(STORAGE_KEY_QUESTIONS)
    removeFromStorage(STORAGE_KEY_FILENAME)
  },

  getRandomQuestions: (count: number) => {
    const shuffled = [...get().questions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length))
  },

  restoreFromStorage: () => {
    const questions = loadFromStorage<Question[]>(STORAGE_KEY_QUESTIONS, [])
    const filename = loadFromStorage<string>(STORAGE_KEY_FILENAME, '')
    if (questions.length > 0) {
      set({ questions, filename })
    } else {
      get().loadBuiltin()
    }
  },
}))
