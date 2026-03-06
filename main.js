const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const path = require('path')
const fs = require('fs')

if (process.platform === 'win32') {
  app.setAppUserModelId('com.c1quiz.app');
}

// 设置应用名称
app.name = "C1认证备考刷题系统"

// 初始化默认题目
function initDefaultQuestions() {
  try {
    const isDev = !app.isPackaged
    const questionsPath = isDev 
      ? path.join(process.cwd(), 'public/questions.json')
      : path.join(app.getPath('userData'), 'questions.json')
    
    if (!fs.existsSync(questionsPath)) {
      let defaultQuestions = []
      
      // 尝试从 src/assets/data/questions.json 读取默认题目
      const defaultQuestionsPath = path.join(__dirname, 'src', 'assets', 'data', 'questions.json')
      
      if (fs.existsSync(defaultQuestionsPath)) {
        console.log('从 src/assets/data/questions.json 读取默认题目...')
        defaultQuestions = JSON.parse(fs.readFileSync(defaultQuestionsPath, 'utf8'))
      } else {
        // 如果文件不存在，使用默认题目
        console.log('src/assets/data/questions.json 不存在，使用内置默认题目...')
        defaultQuestions = [
          {
            id: '1',
            title: '安全生产管理的根本目的是（ ）。',
            options: ['A. 消除隐患，杜绝事故', 'B. 避免造成人身伤亡，财产损失', 'C. 提高企业安全生产管理水平', 'D. 保证生产经营活动中的人身安全，财产安全，促进经济发展'],
            answer: 'D'
          },
          {
            id: '2',
            title: '安全生产管理的方针是（ ）。',
            options: ['A. 安全第一，预防为主，综合治理', 'B. 安全第一，预防为主', 'C. 安全第一，综合治理', 'D. 预防为主，综合治理'],
            answer: 'A'
          }
        ]
      }
      
      // 写入默认题目到文件
      fs.writeFileSync(questionsPath, JSON.stringify(defaultQuestions, null, 2))
      console.log(`默认题目已初始化，共 ${defaultQuestions.length} 道题`)
    }
  } catch (error) {
    console.error('初始化默认题目失败:', error)
  }
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,//窗口宽度
    height: 800,//窗口高度
    minWidth: 600,//最小宽度
    minHeight: 400,//最小高度
    autoHideMenuBar: true,//自动隐藏菜单档
    alwaysOnTop: false,//置顶
    icon: path.join(__dirname, 'public/favicon.ico'),
    ...(process.platform === 'linux' ? { icon } : {}),
    // 窗口是否可调整大小
    resizable: true,
    // 窗口是否可移动
    movable: true,
    // 窗口是否可关闭
    closable: true,
    // 窗口是否可全屏
    fullscreenable: true,
    // 窗口是否可最小化
    minimizable: true,
    // 窗口是否可最大化
    maximizable: true,
    // 窗口是否可恢复
    restoreable: true,
    // 窗口是否可透明
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
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
  // 初始化默认题目
  initDefaultQuestions()
  
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
ipcMain.handle('read-questions', async (event) => {
  try {
    const isDev = !app.isPackaged
    const questionsPath = isDev 
      ? path.join(process.cwd(), 'public/questions.json')
      : path.join(app.getPath('userData'), 'questions.json')
    
    if (fs.existsSync(questionsPath)) {
      const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'))
      return { success: true, data }
    } else {
      // 如果文件不存在，返回空数组
      return { success: true, data: [] }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('write-questions', async (event, questions) => {
  try {
    const isDev = !app.isPackaged
    const questionsPath = isDev 
      ? path.join(process.cwd(), 'public/questions.json')
      : path.join(app.getPath('userData'), 'questions.json')
    
    fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2))
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('delete-question', async (event, questionId) => {
  try {
    const isDev = !app.isPackaged
    const questionsPath = isDev 
      ? path.join(process.cwd(), 'public/questions.json')
      : path.join(app.getPath('userData'), 'questions.json')
    
    if (fs.existsSync(questionsPath)) {
      const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'))
      const updated = data.filter((q) => q.id !== questionId)
      fs.writeFileSync(questionsPath, JSON.stringify(updated, null, 2))
      return { success: true, data: updated }
    } else {
      return { success: true, data: [] }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// 监听名为 'send-notif' 的频道
ipcMain.on('send-notif', (event, data) => {
  // data 就是从渲染进程传过来的对象
  const { title, msg } = data; 

  const notif = new Notification({
    title: title,
    body: msg,
    silent: false
  });

  notif.show();
});
