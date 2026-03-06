const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,//窗口宽度
    height: 800,//窗口高度
    minWidth: 600,//最小宽度
    minHeight: 400,//最小高度
    autoHideMenuBar: true,//自动隐藏菜单档
    alwaysOnTop: false,//置顶
    icon: path.join(__dirname,'./public/icon.svg'),
    ...(process.platform === 'linux' ? { icon } : {}),

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  
  // 判断是否为开发环境
  const isDev = !app.isPackaged
  console.log(isDev,'isDev')
  if (isDev) {
    // 开发环境：使用 Vite 开发服务器
    win.loadURL('http://localhost:5173')
  } else {
    // 生产环境：加载打包后的文件
    win.loadFile(path.join(__dirname, 'dist/index.html'))
  }
  
  // 仅在开发环境下打开调试窗口
  if (isDev) {
    win.openDevTools()  //自动打开调试窗口
  }
  console.log("main.js 已执行")
}

app.on('ready', () => {
  createWindow()
  //兼容核心代码 1
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC 监听器 - 处理题目文件操作
ipcMain.on('read-questions', (event) => {
  try {
    const isDev = !app.isPackaged
    const questionsPath = isDev
      ? path.join(process.cwd(), 'public/questions.json')
      : path.join(app.getPath('userData'), 'questions.json')
    
    if (fs.existsSync(questionsPath)) {
      const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'))
      event.reply('read-questions-response', { success: true, data })
    } else {
      // 如果文件不存在，返回空数组
      event.reply('read-questions-response', { success: true, data: [] })
    }
  } catch (error) {
    event.reply('read-questions-response', { success: false, error: error.message })
  }
})

ipcMain.on('write-questions', (event, questions) => {
  try {
    const isDev = !app.isPackaged
    const questionsPath = isDev 
      ? path.join(process.cwd(), 'public/questions.json')
      : path.join(app.getPath('userData'), 'questions.json')
    
    fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2))
    event.reply('write-questions-response', { success: true })
  } catch (error) {
    event.reply('write-questions-response', { success: false, error: error.message })
  }
})

ipcMain.on('delete-question', (event, questionId) => {
  try {
    const isDev = !app.isPackaged
    const questionsPath = isDev 
      ? path.join(process.cwd(), 'public/questions.json')
      : path.join(app.getPath('userData'), 'questions.json')
    
    if (fs.existsSync(questionsPath)) {
      const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'))
      const updated = data.filter((q) => q.id !== questionId)
      fs.writeFileSync(questionsPath, JSON.stringify(updated, null, 2))
      event.reply('delete-question-response', { success: true, data: updated })
    } else {
      event.reply('delete-question-response', { success: true, data: [] })
    }
  } catch (error) {
    event.reply('delete-question-response', { success: false, error: error.message })
  }
})
