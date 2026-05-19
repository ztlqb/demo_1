import type { Question, OptionKey, AnswerResult, QuestionType } from '@/types'
import OptionButton from './OptionButton'
import { CheckCircle, XCircle } from 'lucide-react'

interface QuestionCardProps {
  question: Question
  index: number
  total: number
  selectedAnswers: string[]
  result: AnswerResult | undefined
  onSelect: (answer: OptionKey) => void
  onSubmit: () => void
}

const typeLabels: Record<QuestionType, { text: string; color: string }> = {
  single: { text: '单选题', color: 'bg-blue-100 text-blue-700' },
  multiple: { text: '多选题', color: 'bg-purple-100 text-purple-700' },
  judge: { text: '判断题', color: 'bg-amber-100 text-amber-700' },
}

export default function QuestionCard({ question, index, total, selectedAnswers, result, onSelect, onSubmit }: QuestionCardProps) {
  const optionKeys: OptionKey[] = ['A', 'B', 'C', 'D', 'E', 'F']
  const hasAnswered = !!result
  const isMultiple = question.type === 'multiple'
  const typeInfo = typeLabels[question.type]
  const correctAnswerText = question.answer

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium opacity-90">第 {index + 1} 题</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeInfo.color}`}>
              {typeInfo.text}
            </span>
          </div>
          <span className="text-sm opacity-75">共 {total} 题</span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-lg text-slate-800 leading-relaxed mb-6 font-medium">
          {question.content}
          {isMultiple && <span className="text-purple-500 text-sm ml-2">（多选）</span>}
        </p>

        <div className="space-y-3">
          {optionKeys.map(key => (
            question.options[key] ? (
              <OptionButton
                key={key}
                label={key}
                text={question.options[key]!}
                selected={selectedAnswers.includes(key)}
                result={result}
                isCorrectOption={question.answer.includes(key)}
                isMultiple={isMultiple}
                disabled={hasAnswered}
                onClick={() => onSelect(key)}
              />
            ) : null
          ))}
        </div>

        {hasAnswered && (
          <div className={`
            mt-5 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
            ${result === 'correct'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
            }
          `}>
            {result === 'correct' ? (
              <>
                <CheckCircle size={18} />
                <span>回答正确</span>
              </>
            ) : (
              <>
                <XCircle size={18} />
                <span>回答错误，正确答案是 {correctAnswerText}</span>
              </>
            )}
          </div>
        )}

        {!hasAnswered && selectedAnswers.length > 0 && (
          <button
            onClick={onSubmit}
            className="mt-5 w-full py-3 rounded-xl bg-blue-600 text-white font-medium
              hover:bg-blue-700 active:scale-[0.98] transition-all duration-200"
          >
            确认答案
          </button>
        )}

        {!hasAnswered && selectedAnswers.length === 0 && (
          <div className="mt-5 w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-medium text-center">
            {isMultiple ? '请选择答案（可多选）' : '请选择答案'}
          </div>
        )}
      </div>
    </div>
  )
}
