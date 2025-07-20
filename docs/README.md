# 📚 Documentation / 文档

## 🌐 Multi-language Documentation / 多语言文档

### 📖 Main Documentation / 主要文档

| Document | 中文 | English |
|----------|------|---------|
| **Main README** | [README.md](../README.md#中文) | [README.md](../README.md#english) |
| **Features** | [FEATURES.md](./FEATURES.md) | [FEATURES_EN.md](./FEATURES_EN.md) |
| **API Documentation** | [API.md](./API.md) | [API_EN.md](./API_EN.md) |
| **Infinite Scroll Implementation** | [infinite-scroll-implementation.md](./infinite-scroll-implementation.md) | Coming Soon |

### 🛠️ Technical Documentation / 技术文档

- **[Infinite Scroll Implementation](./infinite-scroll-implementation.md)** - 无限滚动实现架构分析
- **[API Integration](./API.md)** - TMDB API 集成文档
- **[Features Overview](./FEATURES.md)** - 功能详细说明

### 📋 Configuration Files / 配置文件

- **[.env.example](../.env.example)** - Environment variables template / 环境变量模板
- **[Dockerfile](../Dockerfile)** - Docker configuration / Docker 配置
- **[LICENSE](../LICENSE)** - MIT License / MIT 许可证

### 🚀 Quick Start / 快速开始

1. **Clone the repository / 克隆仓库**
   ```bash
   git clone https://github.com/your-username/tmdb-app.git
   cd tmdb-app
   ```

2. **Install dependencies / 安装依赖**
   ```bash
   npm install
   ```

3. **Configure environment / 配置环境**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your TMDB API key
   # 编辑 .env.local 文件，添加你的 TMDB API key
   ```

4. **Start development server / 启动开发服务器**
   ```bash
   npm run dev
   ```

### 🎯 Project Structure / 项目结构

```
tmdb-app/
├── app/                          # Next.js App Router
│   ├── components/               # React Components / React 组件
│   │   ├── common/              # Common Components / 通用组件
│   │   ├── search/              # Search Components / 搜索组件
│   │   └── ui/                  # UI Components / UI 组件
│   ├── lib/                     # Utilities / 工具库
│   │   ├── api/                 # API Functions / API 函数
│   │   └── utils/               # Utility Functions / 工具函数
│   └── type/                    # TypeScript Types / TypeScript 类型
├── docs/                        # Documentation / 文档
├── public/                      # Static Assets / 静态资源
└── messages/                    # i18n Messages / 国际化消息
```

### 🤝 Contributing / 贡献

We welcome contributions in both Chinese and English! / 我们欢迎中英文贡献！

- **Issues**: Please describe issues in your preferred language / 请用你喜欢的语言描述问题
- **Pull Requests**: Code comments can be in English, commit messages in either language / 代码注释可以用英文，提交信息可以用任一语言
- **Documentation**: Help us improve documentation in both languages / 帮助我们改进双语文档

### 📞 Support / 支持

- **GitHub Issues**: [Create an issue](https://github.com/your-username/tmdb-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/tmdb-app/discussions)
- **Email**: your-email@example.com

---

**Language Preference / 语言偏好**

This project supports both Chinese and English documentation. Choose your preferred language from the links above.

本项目支持中英文文档。请从上面的链接中选择你喜欢的语言。
