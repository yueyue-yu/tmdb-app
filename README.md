# 🎬 ICE·ICE FILM 

A modern movie information system built with TMDB API, providing comprehensive movie, TV series, and actor information browsing.

[English](#english) | [中文](#中文)

---

## 中文

基于 TMDB API 构建的现代化影视信息系统，提供电影、电视剧和演员信息查询功能。

## ✨ 主要功能

- **智能搜索**：支持电影、电视剧、演员的多类型搜索，带筛选功能
- **详细信息**：完整的影视资料、演员表、用户评价展示
- **响应式设计**：适配桌面端和移动端，支持暗色主题
- **性能优化**：服务端渲染、图片懒加载、智能缓存

## 🛠️ 技术栈

- **Next.js 15** - React 全栈框架
- **React 18** - 用户界面库  
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - CSS 框架
- **TMDB API** - 影视数据来源

## 📦 快速开始

### 环境要求
- Node.js 18.0+
- npm 或 yarn

### 安装运行
```bash
# 克隆项目
git clone https://github.com/yueyue-yu/tmdb-app.git
cd tmdb-app

# 安装依赖
npm install

# 环境配置
# 创建 .env.local 文件并添加 TMDB API Key
TMDB_API_KEY=your_tmdb_api_key_here

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 获取 API Key
1. 访问 [TMDB 官网](https://www.themoviedb.org/) 注册账户
2. 前往 [API 设置页面](https://www.themoviedb.org/settings/api) 申请 API Key
3. 将 API Key 添加到 `.env.local` 文件

## 🚀 部署

```bash
# 构建项目
npm run build
npm run start

# Docker 部署
docker build -t tmdb-app .
docker run -p 3000:3000 tmdb-app

# Vercel 部署
# 推送到 GitHub 后在 Vercel 导入项目即可
```

## 🙏 致谢

- [TMDB](https://www.themoviedb.org/) - 影视数据 API
- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

⭐ 如果这个项目对你有帮助，请给它一个星标！

---

## English

A modern movie information system built with TMDB API, providing comprehensive browsing of movies, TV series, and actor information.

## ✨ Key Features

- **Smart Search**: Multi-type search for movies, TV series, and actors with filtering
- **Detailed Information**: Complete movie data, cast, and user reviews display
- **Responsive Design**: Desktop and mobile compatible with dark theme support
- **Performance Optimized**: Server-side rendering, lazy loading, smart caching

## 🛠️ Tech Stack

- **Next.js 15** - React fullstack framework
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - CSS framework
- **TMDB API** - Movie data source

## 📦 Quick Start

### Requirements
- Node.js 18.0+
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/yueyue-yu/tmdb-app.git
cd tmdb-app

# Install dependencies
npm install

# Environment setup
# Create .env.local file and add TMDB API Key
TMDB_API_KEY=your_tmdb_api_key_here

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

### Get API Key
1. Visit [TMDB website](https://www.themoviedb.org/) to register
2. Go to [API settings page](https://www.themoviedb.org/settings/api) to apply for API Key
3. Add API Key to `.env.local` file

## 🚀 Deployment

```bash
# Build project
npm run build
npm run start

# Docker deployment
docker build -t tmdb-app .
docker run -p 3000:3000 tmdb-app

# Vercel deployment
# Push to GitHub and import project in Vercel
```

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) - Movie data API
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

⭐ If this project helps you, please give it a star!

---
