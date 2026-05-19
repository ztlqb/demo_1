export type QuestionType = 'single' | 'multiple' | 'judge'
export type OptionKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface Question {
  id: string
  content: string
  options: Partial<Record<OptionKey, string>>
  answer: string
  type: QuestionType
  analysis: string
}

export interface WrongQuestion extends Question {
  wrongAnswer: string
  addedAt: number
}

export type AnswerResult = 'correct' | 'wrong' | 'unanswered'
