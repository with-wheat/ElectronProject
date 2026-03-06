const { contextBridge, ipcRenderer } = require('electron')

// 将渲染进程的API暴露给主进程
contextBridge.exposeInMainWorld('myAPI', {
  version: () => process.versions,
  saveFile: (data) => {
    ipcRenderer.send('file-save', data)
  },
  // 读取文件内容
  readFile () {
    return ipcRenderer.invoke('file-read')
  },
  // 题目相关操作
  readQuestions: () => {
    return ipcRenderer.invoke('read-questions')
  },
  writeQuestions: (questions) => {
    return ipcRenderer.invoke('write-questions', questions)
  },
  deleteQuestion: (questionId) => {
    return ipcRenderer.invoke('delete-question', questionId)
  },
  sendNotification: (title, msg) => {
    ipcRenderer.send('send-notif', { title, msg })
  }
  // 除函数之外，我们也可以暴露变量
})
