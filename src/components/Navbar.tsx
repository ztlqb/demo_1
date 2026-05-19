import { useNavigate } from 'react-router-dom'
import { BookX } from 'lucide-react'
import { useWrongStore } from '@/store/wrongStore'

export default function Navbar() {
  const navigate = useNavigate()
  const wrongCount = useWrongStore(s => s.wrongQuestions.length)
  return (
    <nav className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
      <button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">← 首页</button>
      <button onClick={() => navigate('/wrong')} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors">
        <BookX size={16} /> 错题本
        {wrongCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wrongCount}</span>}
      </button>
    </nav>
  )
}
