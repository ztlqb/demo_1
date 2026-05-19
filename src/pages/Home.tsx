import { useNavigate } from 'react-router-dom'
import { BookOpen, Trash2, BookX, Play, Upload } from 'lucide-react'
import { useQuestionStore } from '@/store/questionStore'
import { useWrongStore } from '@/store/wrongStore'
import { usePracticeStore } from '@/store/practiceStore'

export default function Home() {
  const navigate = useNavigate()
  const { questions, filename, isLoading, error, loadFromFile, clearQuestions } = useQuestionStore()
  const wrongCount = useWrongStore(s => s.wrongQuestions.length)
  const startPractice = usePracticeStore(s => s.startPractice)
  const getRandomQuestions = useQuestionStore(s => s.getRandomQuestions)

  const singleCount = questions.filter(q => q.type === 'single').length
  const multipleCount = questions.filter(q => q.type === 'multiple').length
  const judgeCount = questions.filter(q => q.type === 'judge').length

  const handleStartPractice = () => {
    const selected = getRandomQuestions(100)
    if (selected.length === 0) return
    startPractice(selected, false)
    navigate('/practice')
  }

  const handleWrongPractice = () => {
    const wrongQuestions = useWrongStore.getState().wrongQuestions.map(w => ({
      id: w.id,
      content: w.content,
      options: w.options,
      answer: w.answer,
      type: w.type,
      analysis: w.analysis,
    }))
    if (wrongQuestions.length === 0) return
    const shuffled = [...wrongQuestions].sort(() => Math.random() - 0.5)
    startPractice(shuffled, true)
    navigate('/practice/wrong')
  }

  const handleReupload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls,.csv'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) loadFromFile(file)
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">模拟考试</h1>
          <p className="text-slate-400 mt-2">随机练习，攻克错题</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{filename || '新分人员考试题库'}</p>
                <p className="text-sm text-slate-400">共 {questions.length} 道题</p>
              </div>
            </div>
            <button
              onClick={clearQuestions}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="清空题库"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {questions.length > 0 && (
            <div className="mt-4 flex gap-2">
              {singleCount > 0 && (
                <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium">
                  单选 {singleCount}
                </span>
              )}
              {multipleCount > 0 && (
                <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-600 text-xs font-medium">
                  多选 {multipleCount}
                </span>
              )}
              {judgeCount > 0 && (
                <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-xs font-medium">
                  判断 {judgeCount}
                </span>
              )}
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div className="space-y-4 mt-4">
            <button
              onClick={handleStartPractice}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg
                hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all duration-200
                shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              <Play size={20} />
              开始练习（随机100题）
            </button>

            {questions.length < 100 && (
              <p className="text-center text-sm text-amber-500">
                题库不足100题，将抽取全部 {questions.length} 题
              </p>
            )}

            {wrongCount > 0 && (
              <button
                onClick={handleWrongPractice}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-lg
                  hover:from-red-600 hover:to-red-700 active:scale-[0.98] transition-all duration-200
                  shadow-lg shadow-red-200 flex items-center justify-center gap-2"
              >
                <BookX size={20} />
                错题练习（{wrongCount}题）
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">正在解析...</span>
          </div>
        )}

        {error && (
          <div className="mt-4 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={handleReupload}
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Upload size={14} /> 上传其他题库文件
          </button>
        </div>
      </div>
    </div>
  )
}
