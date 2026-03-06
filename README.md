# C1 认证备考刷题系统

一个基于 Electron、React 和 TypeScript 构建的桌面应用程序，用于 C1 认证考试的备考刷题。

## 功能特点

- 📚 **完整题库支持**：支持导入 Excel 题库文件，方便管理题目
- 🎯 **智能刷题模式**：提供答题、交卷、查看结果等功能
- 📊 **详细结果分析**：答题完成后显示得分、正确率和错题解析
- ⚙️ **灵活配置**：支持自定义题库和答题设置
- 🖥️ **跨平台支持**：支持 Windows 系统

## 技术栈

- **Electron** - 桌面应用框架
- **React** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 前端构建工具
- **Tailwind CSS** - 样式框架
- **xlsx** - Excel 文件处理

## 开始使用

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发运行

```bash
# 启动开发环境
npm run electron:dev
```

### 打包应用

```bash
# 构建并打包应用
npm run electron:build
```

打包后的安装包位于 `release` 目录中。

## 项目结构
