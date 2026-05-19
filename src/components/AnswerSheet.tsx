import type { AnswerResult } from '@/types'

interface AnswerSheetProps {
  total: number
  currentIndex: number
  results: Record<string, AnswerResult>
  questionIds: string[]
  onJump: (index: number) => void
}

export default function AnswerSheet({ total, currentIndex, results, questionIds, onJump }: AnswerSheetProps) {
  const getCellClass = (id: string, index: number) => {
    const result = results[id]
    const isCurrent = index === currentIndex
    if (result === 'correct') return 'bg-emerald-500 text-white'
    if (result === 'wrong') return 'bg-red-500 text-white'
    if (isCurrent) return 'bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-1'
    return 'bg-slate-100 text-slate-500 hover:bg-blue-100'
  }
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">答题卡</h3>
      <div className="grid grid-cols-5 gap-2">
        {questionIds.map((id, index) => (
          <button key={id} onClick={() => onJump(index)} className={`w-full aspect-square rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center ${getCellClass(id, index)}`}>
            {index + 1}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500" /> 已答对</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> 已答错</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> 当前题</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100" /> 未作答</div>
      </div>
    </div>
  )
}
