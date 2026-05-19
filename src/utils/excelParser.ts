import * as XLSX from 'xlsx'
import type { Question } from '@/types'

interface ParseResult {
  questions: Question[]
  filename: string
}

export async function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' })

        const questions: Question[] = []
        let idx = 0

        for (const row of json) {
          const content = (row['题干'] || '').toString().trim()
          const answerRaw = (row['答案'] || '').toString().trim()
          const type = (row['题型'] || '').toString().trim()
          const optA = (row['选项A'] || '').toString().trim()
          const optB = (row['选项B'] || '').toString().trim()
          const optC = (row['选项C'] || '').toString().trim()
          const optD = (row['选项D'] || '').toString().trim()
          const optE = (row['选项E'] || '').toString().trim()
          const optF = (row['选项F'] || '').toString().trim()

          if (!content || !answerRaw) continue

          let answer = ''
          let qType: 'single' | 'multiple' | 'judge' = 'single'
          const options: Question['options'] = {}

          if (type === '多选题') {
            qType = 'multiple'
            answer = answerRaw.toUpperCase()
            if (optA) options.A = optA
            if (optB) options.B = optB
            if (optC) options.C = optC
            if (optD) options.D = optD
            if (optE) options.E = optE
            if (optF) options.F = optF
          } else if (answerRaw === '对' || answerRaw === '错') {
            qType = 'judge'
            answer = answerRaw === '对' ? 'A' : 'B'
            options.A = '对'
            options.B = '错'
          } else {
            qType = 'single'
            answer = answerRaw.toUpperCase().charAt(0)
            if (optA) options.A = optA
            if (optB) options.B = optB
            if (optC) options.C = optC
            if (optD) options.D = optD
            if (optE) options.E = optE
          }

          idx++
          questions.push({
            id: `q${idx.toString().padStart(4, '0')}`,
            content,
            options,
            answer,
            type: qType,
            analysis: '',
          })
        }

        resolve({ questions, filename: file.name.replace(/\.(xlsx|xls|csv)$/i, '') })
      } catch (err) {
        reject(new Error('文件解析失败，请确保格式正确'))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsArrayBuffer(file)
  })
}
