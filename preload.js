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
  }
  // 除函数之外，我们也可以暴露变量
})
