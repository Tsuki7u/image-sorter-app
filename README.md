# 图片排序工具

一个简单的图片URL排序工具，支持拖拽排序和文件导入导出。

## 功能特性

- 📁 支持上传 .txt 文件（每行一个图片URL）
- 🖱️ 拖拽排序图片
- 📤 导出排序结果
- 🖼️ 图片预览
- 🔄 自动加载默认文件

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用方法

1. 准备一个 .txt 文件，每行包含一个图片URL
2. 上传文件或将文件命名为 `output.txt` 放在 `public` 目录下
3. 拖拽图片进行排序
4. 点击"导出排序结果"保存新的顺序

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- @dnd-kit (拖拽功能)