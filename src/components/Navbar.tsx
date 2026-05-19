import { useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, BookX } from 'lucide-react'
import { useWrongStore } from '@/store/wrongStore'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const wrongCount = useWrongStore(s => s.wrongQuestions.length)

  const links = [
    { path: '/', label: '首页', icon: Home },
    { path: '/wrong', label: `错题集${wrongCount > 0 ? ` (${wrongCount})` : ''}`, icon: BookX },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <BookOpen size={22} className="text-blue-600" />
          <span className="font-bold text-slate-800 text-lg">模拟考试</span>
        </div>

        <div className="flex items-center gap-1">
          {links.map(link => {
            const Icon = link.icon
            const isActive = location.pathname === link.path
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
