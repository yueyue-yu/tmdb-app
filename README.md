# 🎬 TMDB 影视信息系统 / TMDB Movie & TV Information System

[English](#english) | [中文](#中文)

---

## 中文

基于 TMDB API 构建的现代化影视信息系统，提供电影、电视剧和演员的全面信息查询和浏览功能。

## ✨ 功能特色

### 🔍 智能搜索系统
- **极简搜索框设计**：简洁直观的搜索界面
- **无限滚动**：流畅的搜索结果浏览体验
- **多类型搜索**：支持电影、电视剧、演员的综合搜索
- **高级筛选**：年份、评分、类型、排序等多维度筛选

### 🎭 丰富的内容展示
- **电影信息**：详细的电影资料、演员阵容、用户评价
- **电视剧信息**：剧集详情、季度信息、演员表
- **演员档案**：个人简介、作品列表、生涯亮点
- **高清海报**：精美的视觉展示效果

### 🎨 现代化用户界面
- **响应式设计**：完美适配桌面端和移动端
- **暗色主题**：护眼的深色界面设计
- **流畅动画**：丰富的交互动效
- **国际化支持**：多语言界面支持

### 🚀 性能优化
- **服务端渲染**：快速的首屏加载
- **图片懒加载**：优化的图片加载策略
- **缓存机制**：智能的数据缓存
- **代码分割**：按需加载的模块化架构

## 🛠️ 技术栈

### 前端框架
- **Next.js 15** - React 全栈框架
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript

### 样式和UI
- **Tailwind CSS** - 实用优先的 CSS 框架
- **DaisyUI** - 基于 Tailwind 的组件库
- **Heroicons** - 精美的 SVG 图标库

### 状态管理和数据
- **React Hooks** - 现代化的状态管理
- **SWR/React Query** - 数据获取和缓存
- **TMDB API** - 影视数据来源

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git 钩子管理

## 📦 安装和运行

### 环境要求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 1. 克隆项目
```bash
git clone https://github.com/your-username/tmdb-app.git
cd tmdb-app
```

### 2. 安装依赖
```bash
npm install
# 或
yarn install
```

### 3. 环境配置
创建 `.env.local` 文件并配置以下环境变量：

```env
# TMDB API 配置
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 获取 TMDB API Key
1. 访问 [TMDB 官网](https://www.themoviedb.org/)
2. 注册账户并登录
3. 前往 [API 设置页面](https://www.themoviedb.org/settings/api)
4. 申请 API Key
5. 将 API Key 添加到 `.env.local` 文件

### 5. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🏗️ 构建和部署

### 开发环境构建
```bash
npm run build
npm run start
```

### 生产环境部署
项目支持多种部署方式：

#### Vercel 部署（推荐）
1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 自动部署完成

#### Docker 部署
```bash
# 构建镜像
docker build -t tmdb-app .

# 运行容器
docker run -p 3000:3000 tmdb-app
```

#### 静态导出
```bash
npm run export
```

## 📁 项目结构

```
tmdb-app/
├── app/                          # Next.js App Router
│   ├── components/               # React 组件
│   │   ├── common/              # 通用组件
│   │   ├── home/                # 首页组件
│   │   ├── movies/              # 电影相关组件
│   │   ├── search/              # 搜索相关组件
│   │   └── ui/                  # UI 基础组件
│   ├── detail/                  # 详情页面
│   ├── home/                    # 主要页面
│   ├── lib/                     # 工具库
│   │   ├── api/                 # API 接口
│   │   └── utils/               # 工具函数
│   ├── type/                    # TypeScript 类型定义
│   └── globals.css              # 全局样式
├── docs/                        # 项目文档
├── public/                      # 静态资源
├── messages/                    # 国际化文件
├── next.config.js              # Next.js 配置
├── tailwind.config.js          # Tailwind CSS 配置
└── tsconfig.json               # TypeScript 配置
```

## 🎯 核心功能模块

### 搜索系统
- **极简搜索框**：只保留搜索输入框，类型选择移至筛选器
- **无限滚动**：基于 Intersection Observer 的无限滚动实现
- **智能筛选**：媒体类型、年份、评分、类型等多维度筛选
- **实时搜索**：输入即搜索的流畅体验

### 详情页面
- **电影详情**：基本信息、演员阵容、相关推荐、用户评价
- **电视剧详情**：剧集信息、季度详情、演员表、评价
- **演员详情**：个人资料、作品列表、生涯亮点

### 分类浏览
- **电影分类**：热门、高分、正在上映、即将上映
- **电视剧分类**：热门、高分、正在播出、即将播出
- **演员列表**：热门演员浏览

## 🔧 开发指南

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 代码规范
- 组件采用函数式组件和 Hooks
- 使用 CSS-in-JS 或 Tailwind CSS

### 组件开发
```typescript
// 示例组件结构
interface ComponentProps {
  title: string;
  data: DataType[];
}

export default function Component({ title, data }: ComponentProps) {
  // 组件逻辑
  return (
    <div className="component-container">
      {/* 组件内容 */}
    </div>
  );
}
```

### API 集成
```typescript
// API 调用示例
import { fetchMovies } from '@/app/lib/api/movieActions';

const movies = await fetchMovies('popular', 1);
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范
- 提交前运行 `npm run lint` 检查代码
- 确保所有测试通过
- 添加必要的文档说明
- 遵循现有的代码风格

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [TMDB](https://www.themoviedb.org/) - 提供丰富的影视数据 API
- [Next.js](https://nextjs.org/) - 强大的 React 框架
- [Tailwind CSS](https://tailwindcss.com/) - 优秀的 CSS 框架
- [Heroicons](https://heroicons.com/) - 精美的图标库

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目 Issues: [GitHub Issues](https://github.com/your-username/tmdb-app/issues)
- 邮箱: your-email@example.com

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

---

## English

A modern movie and TV information system built with TMDB API, providing comprehensive search and browsing functionality for movies, TV shows, and actors.

## ✨ Features

### 🔍 Smart Search System
- **Minimalist Search Design**: Clean and intuitive search interface
- **Infinite Scroll**: Smooth search results browsing experience
- **Multi-type Search**: Comprehensive search for movies, TV shows, and actors
- **Advanced Filtering**: Multi-dimensional filtering by year, rating, genre, and sorting

### 🎭 Rich Content Display
- **Movie Information**: Detailed movie data, cast, user reviews
- **TV Show Information**: Episode details, season information, cast
- **Actor Profiles**: Personal biography, filmography, career highlights
- **High-quality Posters**: Beautiful visual presentation

### 🎨 Modern User Interface
- **Responsive Design**: Perfect adaptation for desktop and mobile
- **Dark Theme**: Eye-friendly dark interface design
- **Smooth Animations**: Rich interactive effects
- **Internationalization**: Multi-language interface support

### 🚀 Performance Optimization
- **Server-side Rendering**: Fast initial page load
- **Image Lazy Loading**: Optimized image loading strategy
- **Caching Mechanism**: Smart data caching
- **Code Splitting**: Modular architecture with on-demand loading

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15** - React full-stack framework
- **React 18** - User interface library
- **TypeScript** - Type-safe JavaScript

### Styling and UI
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Tailwind-based component library
- **Heroicons** - Beautiful SVG icon library

### State Management and Data
- **React Hooks** - Modern state management
- **SWR/React Query** - Data fetching and caching
- **TMDB API** - Movie and TV data source

### Development Tools
- **ESLint** - Code quality checking
- **Prettier** - Code formatting
- **Husky** - Git hooks management

## 📦 Installation and Setup

### Requirements
- Node.js 18.0 or higher
- npm or yarn package manager

### 1. Clone the Project
```bash
git clone https://github.com/your-username/tmdb-app.git
cd tmdb-app
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file and configure the following environment variables:

```env
# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Get TMDB API Key
1. Visit [TMDB Official Website](https://www.themoviedb.org/)
2. Register an account and log in
3. Go to [API Settings Page](https://www.themoviedb.org/settings/api)
4. Apply for an API Key
5. Add the API Key to your `.env.local` file

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Build and Deployment

### Development Build
```bash
npm run build
npm run start
```

### Production Deployment
The project supports multiple deployment methods:

#### Vercel Deployment (Recommended)
1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Configure environment variables
4. Automatic deployment complete

#### Docker Deployment
```bash
# Build image
docker build -t tmdb-app .

# Run container
docker run -p 3000:3000 tmdb-app
```

#### Static Export
```bash
npm run export
```

## 🎯 Core Features

### Search System
- **Minimalist Search Box**: Only search input box, type selection moved to filters
- **Infinite Scroll**: Intersection Observer-based infinite scroll implementation
- **Smart Filtering**: Media type, year, rating, genre and other multi-dimensional filtering
- **Real-time Search**: Smooth search-as-you-type experience

### Detail Pages
- **Movie Details**: Basic info, cast, related recommendations, user reviews
- **TV Show Details**: Episode info, season details, cast, reviews
- **Actor Details**: Personal profile, filmography, career highlights

### Category Browsing
- **Movie Categories**: Popular, top-rated, now playing, upcoming
- **TV Categories**: Popular, top-rated, on air, airing today
- **Actor Lists**: Popular actors browsing

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Run `npm run lint` before committing
- Ensure all tests pass
- Add necessary documentation
- Follow existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) - Providing rich movie and TV data API
- [Next.js](https://nextjs.org/) - Powerful React framework
- [Tailwind CSS](https://tailwindcss.com/) - Excellent CSS framework
- [Heroicons](https://heroicons.com/) - Beautiful icon library

## 📞 Contact

For questions or suggestions, please contact us through:

- Project Issues: [GitHub Issues](https://github.com/your-username/tmdb-app/issues)
- Email: your-email@example.com

---

⭐ If this project helps you, please give it a star!
