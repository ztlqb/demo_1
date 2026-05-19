import { Trophy, Target, XCircle, HelpCircle } from 'lucide-react'
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-5">
        <Trophy size={36} className="text-white" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">练习完成</h2>
      <p className="text-slate-400 mb-8">
        {isWrongPractice ? '错题练习' : '随机练习'}已结束，以下是你的成绩
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-3xl font-bold text-blue-600">{total}</div>
          <div className="text-xs text-blue-400 mt-1 flex items-center justify-center gap-1">
            <HelpCircle size={12} /> 总题数
          </div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="text-3xl font-bold text-emerald-600">{correct}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center justify-center gap-1">
            <Target size={12} /> 正确
          </div>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <div className="text-3xl font-bold text-red-600">{wrong}</div>
          <div className="text-xs text-red-400 mt-1 flex items-center justify-center gap-1">
            <XCircle size={12} /> 错误
          </div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4">
          <div className="text-3xl font-bold text-amber-600">{accuracy}%</div>
          <div className="text-xs text-amber-400 mt-1">正确率</div>
        </div>
      </div>

      {unanswered > 0 && (
        <p className="text-sm text-slate-400 mb-6">还有 {unanswered} 题未作答</p>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium
            hover:bg-blue-700 active:scale-[0.98] transition-all duration-200"
        >
          再来一次
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-medium
            hover:bg-slate-200 active:scale-[0.98] transition-all duration-200"
        >
          返回首页
        </button>
      </div>
    </div>
  )
}
