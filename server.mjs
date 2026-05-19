import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { networkInterfaces } from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const PORT = 3000

function getLocalIP() {
  const interfaces = networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return '127.0.0.1'
}

const server = http.createServer((req, res) => {
  let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url || 'index.html')

  const ext = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, data) => {
    if (err) {
      filePath = path.join(distDir, 'index.html')
      fs.readFile(filePath, (err2, data2) => {
        if (err2) {
          res.writeHead(404)
          res.end('Not Found')
          return
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(data2)
      })
      return
    }
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  })
})

server.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP()
  console.log('')
  console.log('  ========================================')
  console.log('      模拟考试 - 本地服务器已启动')
  console.log('  ========================================')
  console.log(`  本机访问: http://localhost:${PORT}`)
  console.log(`  手机访问: http://${localIP}:${PORT}`)
  console.log('')
  console.log('  手机扫码或输入上方地址即可访问')
  console.log('  按 Ctrl+C 停止服务器')
  console.log('')
})
