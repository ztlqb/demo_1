import type { AnswerResult } from '@/types'

interface AnswerSheetProps {
  total: number
  currentIndex: number
  results: Record<string, AnswerResult>
  questionIds: string[]
  onJump: (index: number) => void
}

export default function AnswerSheet({ total, currentIndex, results, questionIds, onJump }: AnswerSheetProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-sm font-semibold text-slate-600 mb-3">答题卡</h3>
      <div className="grid grid-cols-10 gap-2">
        {questionIds.map((id, i) => {
          const result = results[id]
          let bgClass = 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          if (result === 'correct') bgClass = 'bg-emerald-500 text-white'
          else if (result === 'wrong') bgClass = 'bg-red-500 text-white'
          else if (i === currentIndex) bgClass = 'bg-blue-500 text-white ring-2 ring-blue-200'

          return (
            <button
              key={id}
              onClick={() => onJump(i)}
              className={`
                w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center
                transition-all duration-150 ${bgClass}
              `}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-500" /> 正确
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500" /> 错误
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-slate-100" /> 未答
        </span>
      </div>
    </div>
  )
}
