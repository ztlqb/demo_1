import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Home from '@/pages/Home'
import Practice from '@/pages/Practice'
import WrongList from '@/pages/WrongList'
import Navbar from '@/components/Navbar'
import { useQuestionStore } from '@/store/questionStore'
import { useWrongStore } from '@/store/wrongStore'

export default function App() {
  const restoreQuestions = useQuestionStore(s => s.restoreFromStorage)
  const restoreWrong = useWrongStore(s => s.restoreFromStorage)

  useEffect(() => {
    restoreQuestions()
    restoreWrong()
  }, [restoreQuestions, restoreWrong])

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/practice/wrong" element={<Practice />} />
        <Route path="/wrong" element={<WrongList />} />
      </Routes>
    </Router>
  )
}
