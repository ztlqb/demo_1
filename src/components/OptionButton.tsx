import type { Question, OptionKey, AnswerResult } from '@/types'
import { CheckCircle, XCircle } from 'lucide-react'

interface OptionButtonProps {
  label: OptionKey
  text: string
  selected: boolean
  result: AnswerResult | undefined
  isCorrectOption: boolean
  isMultiple: boolean
  disabled: boolean
  onClick: () => void
}

export default function OptionButton({ label, text, selected, result, isCorrectOption, isMultiple, disabled, onClick }: OptionButtonProps) {
  if (!text) return null

  let bgClass = 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
  let textClass = 'text-slate-700'

  if (result) {
    disabled = true
    if (isCorrectOption) {
      bgClass = 'bg-emerald-50 border-emerald-400'
      textClass = 'text-emerald-700'
    } else if (selected && result === 'wrong') {
      bgClass = 'bg-red-50 border-red-400'
      textClass = 'text-red-700'
    } else {
      bgClass = 'bg-slate-50 border-slate-200'
      textClass = 'text-slate-400'
    }
  } else if (selected) {
    bgClass = 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
    textClass = 'text-blue-700'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2
        transition-all duration-200 text-left
        ${bgClass} ${textClass}
        ${disabled ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}
      `}
    >
      <span className={`
        w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0
        ${result
          ? isCorrectOption
            ? 'bg-emerald-500 text-white'
            : selected && result === 'wrong'
              ? 'bg-red-500 text-white'
              : 'bg-slate-200 text-slate-400'
          : selected
            ? 'bg-blue-500 text-white'
            : 'bg-slate-100 text-slate-500'
        }
      `}>
        {result ? (
          isCorrectOption ? <CheckCircle size={18} /> :
          selected && result === 'wrong' ? <XCircle size={18} /> :
          label
        ) : isMultiple ? (
          <span className="text-xs">{selected ? '✓' : label}</span>
        ) : label}
      </span>
      <span className="text-[15px] leading-relaxed">{text}</span>
    </button>
  )
}
