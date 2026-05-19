import * as XLSX from 'xlsx'
import type { Question, OptionKey } from '@/types'

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

function normalizeHeader(header: string): string {
  return header.trim().replace(/\s+/g, '')
}

function findColumn(headers: string[], candidates: string[]): number {
  for (const c of candidates) {
    const idx = headers.findIndex(h => normalizeHeader(h).includes(c))
    if (idx !== -1) return idx
  }
  return -1
}

export function parseExcelFile(file: File): Promise<{ questions: Question[]; filename: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' })

        if (jsonData.length === 0) {
          reject(new Error('表格中没有数据'))
          return
        }

        const headers = Object.keys(jsonData[0])
        const colContent = findColumn(headers, ['题目', '题干', '问题', '内容'])
        const colA = findColumn(headers, ['选项A', 'A', '选项a'])
        const colB = findColumn(headers, ['选项B', 'B', '选项b'])
        const colC = findColumn(headers, ['选项C', 'C', '选项c'])
        const colD = findColumn(headers, ['选项D', 'D', '选项d'])
        const colAnswer = findColumn(headers, ['答案', '正确答案', '正确选项'])

        if (colContent === -1 || colAnswer === -1) {
          reject(new Error('表格格式不正确，需要包含"题目"和"答案"列'))
          return
        }

        const questions: Question[] = []

        for (const row of jsonData) {
          const content = row[headers[colContent]]?.toString().trim()
          const answerRaw = row[headers[colAnswer]]?.toString().trim().toUpperCase()
          if (!content || !answerRaw) continue

          const answer = answerRaw.charAt(0) as OptionKey
          if (!['A', 'B', 'C', 'D'].includes(answer)) continue

          const optA = colA !== -1 ? row[headers[colA]]?.toString().trim() || '' : ''
          const optB = colB !== -1 ? row[headers[colB]]?.toString().trim() || '' : ''
          const optC = colC !== -1 ? row[headers[colC]]?.toString().trim() || '' : ''
          const optD = colD !== -1 ? row[headers[colD]]?.toString().trim() || '' : ''

          questions.push({
            id: generateId(),
            content,
            options: { A: optA, B: optB, C: optC, D: optD },
            answer,
            type: 'single' as const,
            analysis: '',
          })
        }

        if (questions.length === 0) {
          reject(new Error('未能从表格中解析出有效题目'))
          return
        }

        resolve({ questions, filename: file.name })
      } catch (err) {
        reject(new Error('文件解析失败：' + (err instanceof Error ? err.message : String(err))))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsArrayBuffer(file)
  })
}

export function getRandomQuestions(questions: Question[], count: number): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
