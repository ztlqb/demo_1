import { Trophy, RotateCcw, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ResultPanelProps {
  total: number
  correct: number
  wrong: number
  unanswered: number
  accuracy: string
  isWrongPractice: boolean
  onRestart: () => void
}

export default function ResultPanel({ total, correct, wrong, unanswered, accuracy, isWrongPractice, onRestart }: ResultPanelProps) {
  const navigate = useNavigate()
  const score = Math.round((correct / total) * 100)
  const grade = score >= 90 ? '优秀' : score >= 70 ? '良好' : score >= 60 ? '及格' : '不及格'
  const gradeColor = score >= 90 ? 'text-emerald-500' : score >= 70 ? 'text-blue-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white text-center">
        <Trophy size={40} className="mx-auto mb-2 opacity-90" />
        <h2 className="text-xl font-bold">练习完成</h2>
      </div>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className={`text-5xl font-bold mb-1 ${gradeColor}`}>{score}</div>
          <div className="text-slate-400 text-sm">分</div>
          <div className={`text-lg font-semibold mt-2 ${gradeColor}`}>{grade}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{correct}</div>
            <div className="text-xs text-emerald-500 mt-1">答对</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{wrong}</div>
            <div className="text-xs text-red-500 mt-1">答错</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-600">{unanswered}</div>
            <div className="text-xs text-slate-400 mt-1">未答</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-xs text-blue-400 mt-1">正确率</div>
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={onRestart} className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
            <RotateCcw size={18} /> 再练一次
          </button>
          <button onClick={() => navigate('/')} className="w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
            <Home size={18} /> 返回首页
          </button>
        </div>
      </div>
    </div>
  )
}
