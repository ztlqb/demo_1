import { Upload, FileSpreadsheet } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isLoading: boolean
  error: string | null
}

export default function FileUpload({ onFileSelect, isLoading, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !['xlsx', 'xls', 'csv'].includes(ext)) {
      return
    }
    onFileSelect(file)
  }, [onFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleClick = () => inputRef.current?.click()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center gap-4
          w-full py-16 px-8 rounded-2xl border-2 border-dashed
          cursor-pointer transition-all duration-300
          ${isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
          }
          ${isLoading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleChange}
          className="hidden"
        />
        <div className={`
          w-20 h-20 rounded-2xl flex items-center justify-center
          transition-all duration-300
          ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}
        `}>
          {isDragging ? <FileSpreadsheet size={40} /> : <Upload size={40} />}
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-slate-700">
            {isDragging ? '松开鼠标上传文件' : '点击或拖拽上传题库文件'}
          </p>
          <p className="text-sm text-slate-400 mt-1">支持 .xlsx / .xls / .csv 格式</p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">正在解析...</span>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-3 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
