import { useNavigate } from 'react-router-dom'
import { Trash2, Play, BookX, ArrowLeft } from 'lucide-react'
import { useWrongStore } from '@/store/wrongStore'
import { usePracticeStore } from '@/store/practiceStore'
import type { QuestionType } from '@/types'

const typeLabels: Record<QuestionType, { text: string; color: string }> = {
  single: { text: '单选', color: 'bg-blue-50 text-blue-600' },
  multiple: { text: '多选', color: 'bg-purple-50 text-purple-600' },
  judge: { text: '判断', color: 'bg-amber-50 text-amber-600' },
}

export default function WrongList() {
  const navigate = useNavigate()
  const { wrongQuestions, removeWrongQuestion, clearWrongQuestions } = useWrongStore()
  const startPractice = usePracticeStore(s => s.startPractice)

  const handlePractice = () => {
    if (wrongQuestions.length === 0) return
    const questions = wrongQuestions.map(w => ({
      id: w.id,
      content: w.content,
      options: w.options,
      answer: w.answer,
      type: w.type,
      analysis: w.analysis,
    }))
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    startPractice(shuffled, true)
    navigate('/practice/wrong')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} /> 返回首页
          </button>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookX size={20} className="text-red-500" />
            错题集
          </h2>
        </div>

        {wrongQuestions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <BookX size={36} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-lg">暂无错题</p>
            <p className="text-slate-300 text-sm mt-1">练习中答错的题目会自动收录在这里</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500">共 {wrongQuestions.length} 道错题</span>
              <div className="flex gap-2">
                <button
                  onClick={handlePractice}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium
                    hover:bg-red-600 active:scale-[0.98] transition-all duration-200"
                >
                  <Play size={14} /> 错题练习
                </button>
                <button
                  onClick={clearWrongQuestions}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm font-medium
                    hover:bg-red-50 hover:text-red-500 active:scale-[0.98] transition-all duration-200"
                >
                  <Trash2 size={14} /> 清空
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {wrongQuestions.map((q, i) => {
                const typeInfo = typeLabels[q.type]
                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-slate-400 text-sm">{i + 1}.</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${typeInfo.color}`}>
                            {typeInfo.text}
                          </span>
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed">
                          {q.content}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(['A', 'B', 'C', 'D', 'E', 'F'] as const).map(key => (
                            q.options[key] ? (
                              <span
                                key={key}
                                className={`
                                  inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium
                                  ${q.answer.includes(key)
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : q.wrongAnswer.includes(key)
                                      ? 'bg-red-50 text-red-700'
                                      : 'bg-slate-50 text-slate-500'
                                  }
                                `}
                              >
                                {key}. {q.options[key]}
                              </span>
                            ) : null
                          ))}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs">
                          <span className="text-red-500">你的答案: {q.wrongAnswer}</span>
                          <span className="text-emerald-600">正确答案: {q.answer}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeWrongQuestion(q.id)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                        title="移除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
