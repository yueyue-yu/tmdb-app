# HomeHero 组件彻底响应式重构

## 任务概述
对 `/home` 页面的 HomeHero 组件进行彻底的响应式重构，为移动端和非移动端设计不同的布局和交互体验。

## 重构策略

### 🎯 设计理念
- **移动端**：类似 Instagram Story 的垂直卡片设计
- **非移动端**：类似电影院海报墙的展示效果

## 完成的修改

### 阶段1：移动端专属设计 ✅

**布局特点**：
- 垂直居中的卡片式布局
- 海报居中显示（160x240px）
- 信息垂直排列，简化内容
- 全宽按钮设计
- 底部居中的轮播指示器

**具体实现**：
```tsx
{/* 移动端布局 - 垂直卡片式 */}
<div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-4 text-center text-white md:hidden">
  {/* 海报 */}
  <div className="mb-6">
    <Image
      src={getPosterUrl(currentMovie.poster_path)}
      alt={currentMovie.title}
      width={160}
      height={240}
      className="rounded-xl shadow-2xl mx-auto"
      sizes="160px"
    />
  </div>
  
  {/* 标题 */}
  <h1 className="text-2xl font-bold mb-3 drop-shadow-lg px-4">
    {currentMovie.title}
  </h1>
  
  {/* 评分 */}
  <div className="flex items-center justify-center gap-2 mb-4">
    <div className="flex gap-1">
      {renderStars(currentMovie.vote_average)}
    </div>
    <span className="text-lg font-semibold">
      {currentMovie.vote_average.toFixed(1)}
    </span>
  </div>
  
  {/* 年份标签 */}
  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
    <CalendarIcon className="w-4 h-4" />
    <span className="font-medium">{getYear(currentMovie.release_date)}</span>
  </div>
  
  {/* 简化的简介 */}
  <p className="text-sm opacity-90 mb-6 px-4 line-clamp-2 leading-relaxed">
    {currentMovie.overview}
  </p>
  
  {/* 全宽按钮 */}
  <Link
    href={`/detail/movie/${currentMovie.id}`}
    className="btn btn-primary btn-lg w-full max-w-xs gap-2 shadow-lg"
  >
    <InformationCircleIcon className="w-5 h-5" />
    {t('viewDetails')}
  </Link>
</div>
```

### 阶段2：非移动端现代化设计 ✅

**布局特点**：
- 电影院式水平布局
- 海报左侧（200x300px）
- 信息右侧，丰富展示
- 双按钮设计（详情 + 预告片）
- 右下角轮播指示器

**具体实现**：
```tsx
{/* 非移动端布局 - 电影院式 */}
<div className="hidden md:flex relative z-10 w-full h-full items-center p-8 lg:p-12">
  <div className="max-w-6xl mx-auto w-full">
    <div className="flex items-center gap-8 lg:gap-12">
      {/* 海报 */}
      <div className="flex-shrink-0">
        <Image
          src={getPosterUrl(currentMovie.poster_path)}
          alt={currentMovie.title}
          width={200}
          height={300}
          className="rounded-xl shadow-2xl"
          sizes="(max-width: 1024px) 160px, 200px"
        />
      </div>
      
      {/* 电影信息 */}
      <div className="flex-1 text-white">
        {/* 标题 */}
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
          {currentMovie.title}
        </h1>
        
        {/* 评分和信息标签 */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* 星级评分 */}
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="flex gap-1">
              {renderStars(currentMovie.vote_average)}
            </div>
            <span className="text-lg font-semibold">
              {currentMovie.vote_average.toFixed(1)}
            </span>
          </div>
          
          {/* 年份 */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <CalendarIcon className="w-4 h-4" />
            <span className="font-medium">{getYear(currentMovie.release_date)}</span>
          </div>
          
          {/* 热门标签 */}
          <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
            <TagIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">热门</span>
          </div>
        </div>
        
        {/* 简介 */}
        <p className="text-lg lg:text-xl mb-8 opacity-90 max-w-3xl leading-relaxed line-clamp-3">
          {currentMovie.overview}
        </p>
        
        {/* 操作按钮 */}
        <div className="flex gap-4">
          <Link
            href={`/detail/movie/${currentMovie.id}`}
            className="btn btn-primary btn-lg gap-2 shadow-lg hover:scale-105 transition-transform"
          >
            <InformationCircleIcon className="w-5 h-5" />
            {t('viewDetails')}
          </Link>
          <button className="btn btn-outline btn-lg gap-2 text-white border-white/50 hover:bg-white/10 hover:border-white">
            <PlayIcon className="w-5 h-5" />
            预告片
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 阶段3：统一优化 ✅

**响应式渐变遮罩**：
```tsx
{/* 响应式渐变遮罩 */}
<div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 md:bg-gradient-to-r md:from-black/80 md:via-black/60 md:to-black/40" />
<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent md:bg-gradient-to-t md:from-black/90 md:via-black/30 md:to-transparent" />
```

**响应式轮播指示器**：
```tsx
{/* 响应式轮播指示器 */}
<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 md:bottom-6 md:right-6 md:left-auto md:transform-none flex gap-2 z-20">
  {featuredMovies.map((_, index) => (
    <button
      key={index}
      onClick={() => setCurrentMovieIndex(index)}
      className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
        index === currentMovieIndex
          ? 'bg-white shadow-lg scale-110'
          : 'bg-white/40 hover:bg-white/60 hover:scale-105'
      }`}
      aria-label={`切换到第${index + 1}部电影`}
    />
  ))}
</div>
```

## 主要改进

### 📱 移动端体验
- ✅ 垂直居中的卡片式布局，类似 Instagram Story
- ✅ 海报在移动端显示，不再隐藏
- ✅ 信息简化，突出核心内容
- ✅ 全宽按钮，触摸友好
- ✅ 底部居中轮播指示器

### 💻 非移动端体验
- ✅ 电影院式水平布局，视觉冲击力强
- ✅ 更大的海报展示（200x300px）
- ✅ 丰富的信息展示和标签设计
- ✅ 双按钮设计（详情 + 预告片）
- ✅ 增强的悬停效果和动画

### 🎨 视觉优化
- ✅ 响应式渐变遮罩，确保文字可读性
- ✅ 统一的圆角设计（rounded-xl）
- ✅ 改进的阴影效果（shadow-2xl）
- ✅ 毛玻璃效果的标签（backdrop-blur-sm）
- ✅ 微妙的动画效果（hover:scale-105）

### ♿ 可访问性改进
- ✅ 添加 aria-label 标签
- ✅ 改进的图片 sizes 属性
- ✅ 更好的键盘导航支持

## 技术细节

### 断点策略
- **移动端**：默认样式（< 768px）
- **非移动端**：md: 前缀（≥ 768px）

### 性能优化
- 优化图片 sizes 属性
- 使用 priority 加载关键图片
- 减少不必要的重渲染

### 阶段4：轮播图优化 ✅

**用户反馈优化**：
- ✅ 改为左右轮播图，露出边缘效果
- ✅ 去掉底部的指示器点
- ✅ 移动端移除查看详情按钮
- ✅ 添加左右导航按钮

**轮播图实现**：
```tsx
{/* 轮播容器 */}
<div className="relative min-h-[60vh] md:min-h-[70vh] overflow-hidden px-4 md:px-8">
  <div className="relative w-full h-full">
    {/* 轮播卡片容器 */}
    <div className="flex transition-transform duration-500 ease-in-out h-full gap-4 md:gap-8"
         style={{ transform: `translateX(calc(-${currentMovieIndex * 100}% - ${currentMovieIndex * 1}rem))` }}>
      {featuredMovies.map((movie, index) => {
        return (
          <div key={movie.id} className="w-full flex-shrink-0 relative rounded-2xl overflow-hidden">
            {/* 每个轮播卡片的内容 */}
          </div>
        );
      })}
    </div>

    {/* 左右导航按钮 */}
    {featuredMovies.length > 1 && (
      <>
        <button
          onClick={() => setCurrentMovieIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          {/* 左箭头 */}
        </button>

        <button
          onClick={() => setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          {/* 右箭头 */}
        </button>
      </>
    )}
  </div>
</div>
```

**移动端优化**：
```tsx
{/* 移动端布局 - 移除查看详情按钮 */}
<div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-4 text-center text-white md:hidden">
  {/* 海报 */}
  <div className="mb-6">
    <Image
      src={getPosterUrl(movie.poster_path)}
      alt={movie.title}
      width={160}
      height={240}
      className="rounded-xl shadow-2xl mx-auto"
      sizes="160px"
    />
  </div>

  {/* 标题 */}
  <h1 className="text-2xl font-bold mb-3 drop-shadow-lg px-4">
    {movie.title}
  </h1>

  {/* 评分 */}
  <div className="flex items-center justify-center gap-2 mb-4">
    <div className="flex gap-1">
      {renderStars(movie.vote_average)}
    </div>
    <span className="text-lg font-semibold">
      {movie.vote_average.toFixed(1)}
    </span>
  </div>

  {/* 年份标签 */}
  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
    <CalendarIcon className="w-4 h-4" />
    <span className="font-medium">{getYear(movie.release_date)}</span>
  </div>

  {/* 简化的简介 */}
  <p className="text-sm opacity-90 mb-6 px-4 line-clamp-2 leading-relaxed">
    {movie.overview}
  </p>

  {/* 移除了查看详情按钮 */}
</div>
```

## 最新优化特点

### 🎠 轮播图设计
- **左右轮播**：卡片式轮播，露出左右边缘
- **导航按钮**：左右圆形导航按钮，悬停放大效果
- **平滑过渡**：500ms 缓动动画
- **间距设计**：卡片间有适当间距，营造层次感

### 📱 移动端简化
- **移除按钮**：去掉查看详情按钮，界面更简洁
- **纯展示**：专注于内容展示，减少交互干扰
- **触摸友好**：左右导航按钮适合触摸操作

### 💻 非移动端保持
- **双按钮设计**：保留详情和预告片按钮
- **丰富信息**：完整的标签和信息展示
- **悬停效果**：按钮悬停放大效果

### 阶段5：轮播图高度统一修复 ✅

**问题分析**：
- 不同电影简介长度不同，导致卡片高度变化
- 条件渲染 `index === currentMovieIndex` 导致高度计算问题
- 缺少统一的高度约束

**解决方案**：
1. **统一容器高度**：
   - 主容器使用固定高度：`h-[60vh] md:h-[70vh]`
   - 卡片使用 `h-full` 继承容器高度
   - 移除 `min-h-` 类名，避免高度不一致

2. **移除条件渲染**：
   - 所有卡片都渲染完整内容，不再使用 `index === currentMovieIndex`
   - 确保每个卡片都有相同的DOM结构

3. **固定内容区域高度**：
   - 移动端简介区域：`h-12` 固定高度
   - 非移动端标题区域：`h-20 lg:h-32` 固定高度
   - 非移动端简介区域：`h-24 lg:h-32` 固定高度

**修复后的结构**：
```tsx
{/* 主容器 - 固定高度 */}
<div className="relative h-[60vh] md:h-[70vh] overflow-hidden px-4 md:px-8">
  <div className="relative w-full h-full">
    {/* 轮播卡片容器 */}
    <div className="flex transition-transform duration-500 ease-in-out h-full gap-4 md:gap-8">
      {featuredMovies.map((movie, index) => (
        <div key={movie.id} className="w-full h-full flex-shrink-0 relative rounded-2xl overflow-hidden">
          {/* 每个卡片都有相同的高度和结构 */}

          {/* 移动端布局 */}
          <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-4 text-center text-white md:hidden">
            {/* 标题 - 限制行数 */}
            <h1 className="text-2xl font-bold mb-3 drop-shadow-lg px-4 line-clamp-2">
              {movie.title}
            </h1>

            {/* 简介 - 固定高度容器 */}
            <div className="h-12 flex items-center mb-6">
              <p className="text-sm opacity-90 px-4 line-clamp-2 leading-relaxed">
                {movie.overview}
              </p>
            </div>
          </div>

          {/* 非移动端布局 */}
          <div className="hidden md:flex relative z-10 w-full h-full items-center p-8 lg:p-12">
            {/* 标题 - 固定高度容器 */}
            <div className="h-20 lg:h-32 flex items-center mb-6">
              <h1 className="text-4xl lg:text-6xl font-bold drop-shadow-lg line-clamp-2">
                {movie.title}
              </h1>
            </div>

            {/* 简介 - 固定高度容器 */}
            <div className="h-24 lg:h-32 flex items-start mb-8">
              <p className="text-lg lg:text-xl opacity-90 max-w-3xl leading-relaxed line-clamp-3">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
```

### 阶段6：移动端海报背景优化 ✅

**用户反馈**：
- PC端样式好看，但移动端垂直布局很奇怪
- 希望移动端直接使用海报作为背景

**优化方案**：
1. **移动端背景切换**：
   - 移动端使用海报图片作为背景
   - 非移动端继续使用横版背景图
   - 分别优化不同的渐变遮罩

2. **移动端布局重新设计**：
   - 改为底部信息覆盖式布局
   - 信息区域使用渐变背景确保可读性
   - 移除独立的海报展示，直接作为背景

**实现代码**：
```tsx
{/* 背景图片 - 移动端使用海报，非移动端使用背景图 */}
<div className="absolute inset-0">
  {/* 移动端海报背景 */}
  <div className="md:hidden">
    <Image
      src={getPosterUrl(movie.poster_path)}
      alt={movie?.title || 'Hero Background'}
      fill
      className="object-cover"
      priority={index === 0}
      sizes="100vw"
    />
    {/* 移动端渐变遮罩 - 更强的遮罩确保文字可读 */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
  </div>

  {/* 非移动端背景图 */}
  <div className="hidden md:block">
    <Image
      src={backdropUrl}
      alt={movie?.title || 'Hero Background'}
      fill
      className="object-cover"
      priority={index === 0}
      sizes="100vw"
    />
    {/* 非移动端渐变遮罩 */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
  </div>
</div>

{/* 移动端布局 - 底部信息覆盖 */}
<div className="relative z-10 w-full h-full flex flex-col justify-end p-4 text-white md:hidden">
  {/* 底部信息区域 */}
  <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 rounded-t-2xl">
    {/* 标题 */}
    <h1 className="text-2xl font-bold mb-3 drop-shadow-lg line-clamp-2">
      {movie.title}
    </h1>

    {/* 评分和年份 */}
    <div className="flex items-center justify-center gap-4 mb-4">
      {/* 评分 */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {renderStars(movie.vote_average)}
        </div>
        <span className="text-lg font-semibold">
          {movie.vote_average.toFixed(1)}
        </span>
      </div>

      {/* 年份标签 */}
      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
        <CalendarIcon className="w-4 h-4" />
        <span className="font-medium">{getYear(movie.release_date)}</span>
      </div>
    </div>

    {/* 简化的简介 */}
    <div className="h-12 flex items-center">
      <p className="text-sm opacity-90 line-clamp-2 leading-relaxed text-center">
        {movie.overview}
      </p>
    </div>
  </div>
</div>
```

**优化特点**：
- **移动端**：海报作为全屏背景，底部信息覆盖，类似电影海报设计
- **非移动端**：保持横版背景图，电影院式布局
- **视觉统一**：两种布局都保持电影主题的视觉风格
- **可读性**：移动端使用更强的渐变遮罩确保文字清晰

## 状态
- [x] 移动端专属设计完成
- [x] 非移动端现代化设计完成
- [x] 统一优化完成
- [x] 轮播图优化完成
- [x] 移动端按钮移除完成
- [x] 轮播图高度统一修复完成
- [x] 移动端海报背景优化完成
- [x] 代码重构完成
- [ ] 浏览器效果验证

## 测试访问
开发服务器：http://localhost:3001/home

**重点测试项目**：
1. 轮播图左右切换效果
2. 左右边缘露出效果
3. 移动端无查看详情按钮
4. 导航按钮的悬停效果
5. 不同设备尺寸下的显示效果
