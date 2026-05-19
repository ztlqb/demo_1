import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePracticeStore } from '@/store/practiceStore'
import { useQuestionStore } from '@/store/questionStore'
import QuestionCard from '@/components/QuestionCard'
import AnswerSheet from '@/components/AnswerSheet'
import ResultPanel from '@/components/ResultPanel'
import type { OptionKey } from '@/types'

export default function Practice() {
  const navigate = useNavigate()
  const { questions, currentIndex, answers, results, isWrongPractice, selectAnswer, toggleAnswer, submitAnswer, nextQuestion, prevQuestion, goToQuestion, isFinished, getStats, startPractice } = usePracticeStore()
  const getRandomQuestions = useQuestionStore(s => s.getRandomQuestions)

  useEffect(() => {
    if (questions.length === 0) navigate('/')
  }, [questions.length, navigate])

  if (questions.length === 0) return null

  const finished = isFinished()
  const stats = getStats()
  const currentQuestion = questions[currentIndex]
  const questionIds = questions.map(q => q.id)

  const handleSelect = (answer: OptionKey) => {
    if (currentQuestion.type === 'multiple') toggleAnswer(currentQuestion.id, answer)
    else selectAnswer(currentQuestion.id, answer)
  }

  const handleRestart = () => {
    if (isWrongPractice) navigate('/wrong')
    else {
      const selected = getRandomQuestions(100)
      if (selected.length > 0) startPractice(selected, false)
      else navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/')} className="text-sm text-slate-400 hover:text-blue-600 transition-colors">← 返回首页</button>
          <span className="text-sm font-medium text-slate-500">{isWrongPractice ? '错题练习' : '随机练习'}</span>
        </div>
        {finished ? (
          <ResultPanel total={stats.total} correct={stats.correct} wrong={stats.wrong} unanswered={stats.unanswered} accuracy={stats.accuracy} isWrongPractice={isWrongPractice} onRestart={handleRestart} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <QuestionCard question={currentQuestion} index={currentIndex} total={questions.length} selectedAnswers={answers[currentQuestion.id] || []} result={results[currentQuestion.id]} onSelect={handleSelect} onSubmit={() => submitAnswer(currentQuestion.id)} />
              <div className="flex items-center justify-between mt-4">
                <button onClick={prevQuestion} disabled={currentIndex === 0} className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}>
                  <ChevronLeft size={16} /> 上一题
                </button>
                <span className="text-sm text-slate-400">{currentIndex + 1} / {questions.length}</span>
                <button onClick={nextQuestion} disabled={currentIndex === questions.length - 1} className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentIndex === questions.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}>
                  下一题 <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="lg:w-72 shrink-0">
              <AnswerSheet total={questions.length} currentIndex={currentIndex} results={results} questionIds={questionIds} onJump={goToQuestion} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
