const STORAGE_KEY_WRONG = 'exam_wrong_questions'
const STORAGE_KEY_QUESTIONS = 'exam_questions'
const STORAGE_KEY_FILENAME = 'exam_filename'

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch {}
  return fallback
}

export function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {}
}

export { STORAGE_KEY_WRONG, STORAGE_KEY_QUESTIONS, STORAGE_KEY_FILENAME }
