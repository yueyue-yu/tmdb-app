# 无限滚动实现架构分析

## 概述

本项目实现了一套完整的无限滚动系统，用于搜索结果的展示。该系统采用了模块化设计，包含自定义Hook、通用组件和业务组件，提供了良好的用户体验和开发体验。

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    搜索页面 (SearchPage)                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              SearchResultsInfinite                         │
│  • 处理搜索参数                                              │
│  • 调用统一搜索API                                           │
│  • 渲染搜索结果项                                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              InfiniteScrollContainer                       │
│  • 通用无限滚动容器                                          │
│  • 管理数据展示和加载状态                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                useInfiniteScroll                           │
│  • 核心无限滚动逻辑                                          │
│  • Intersection Observer 实现                              │
│  • 状态管理和错误处理                                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  LoadingTrigger                            │
│  • 加载触发器组件                                            │
│  • 显示加载状态和错误信息                                     │
└─────────────────────────────────────────────────────────────┘
```

## 核心组件详解

### 1. useInfiniteScroll Hook

**位置**: `app/hooks/useInfiniteScroll.ts`

这是整个无限滚动系统的核心，负责：

#### 主要功能
- **状态管理**: 管理数据列表、加载状态、分页信息
- **Intersection Observer**: 监听触发器元素的可见性
- **数据加载**: 调用加载函数获取新数据
- **错误处理**: 处理加载失败的情况

#### 关键实现
```typescript
// 状态接口
interface InfiniteScrollState<T> {
  items: T[];           // 已加载的数据列表
  loading: boolean;     // 是否正在加载
  hasMore: boolean;     // 是否还有更多数据
  error: string | null; // 错误信息
  currentPage: number;  // 当前页码
}

// 加载函数类型
type LoadMoreFunction<T> = (page: number) => Promise<{
  items: T[];
  hasMore: boolean;
  totalPages?: number;
}>;
```

#### 核心逻辑
1. **Intersection Observer 设置**:
   ```typescript
   const observerRef = useRef<IntersectionObserver | null>(null);
   
   // 创建观察器
   observerRef.current = new IntersectionObserver(
     (entries) => {
       const [entry] = entries;
       if (entry.isIntersecting && !loadingRef.current && state.hasMore) {
         loadMoreData(); // 触发加载
       }
     },
     {
       threshold: 0.1,      // 10%可见时触发
       rootMargin: '100px'  // 提前100px触发
     }
   );
   ```

2. **数据加载逻辑**:
   ```typescript
   const loadMoreData = useCallback(async () => {
     if (loadingRef.current || !state.hasMore || !enabled) return;
     
     loadingRef.current = true;
     setState(prev => ({ ...prev, loading: true, error: null }));
     
     try {
       const nextPage = state.currentPage + 1;
       const result = await loadMore(nextPage);
       
       setState(prev => ({
         ...prev,
         items: [...prev.items, ...result.items], // 追加新数据
         hasMore: result.hasMore,
         currentPage: nextPage,
         loading: false
       }));
     } catch (error) {
       // 错误处理
     } finally {
       loadingRef.current = false;
     }
   }, [loadMore, state.currentPage, state.hasMore, enabled]);
   ```

### 2. InfiniteScrollContainer 组件

**位置**: `app/components/common/InfiniteScrollContainer.tsx`

通用的无限滚动容器组件，提供：

#### 主要功能
- **数据渲染**: 使用传入的renderItem函数渲染每个数据项
- **状态展示**: 显示加载状态、错误状态、空状态
- **回到顶部**: 集成BackToTop组件
- **加载触发**: 集成LoadingTrigger组件

#### 关键特性
```typescript
interface InfiniteScrollContainerProps<T> {
  loadMore: LoadMoreFunction<T>;           // 加载更多数据的函数
  renderItem: (item: T, index: number) => ReactNode; // 渲染单个项目
  renderEmpty?: () => ReactNode;           // 空状态渲染
  renderError?: (error: string, retry: () => void) => ReactNode; // 错误状态渲染
  config?: InfiniteScrollConfig;           // 配置选项
  showBackToTop?: boolean;                 // 是否显示回到顶部按钮
  backToTopThreshold?: number;             // 回到顶部按钮显示阈值
}
```

#### 布局结构
```typescript
return (
  <div className={className}>
    {/* 数据列表 - 单列列表布局 */}
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={uniqueKey} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>

    {/* 加载触发器 */}
    <LoadingTrigger
      loading={loading}
      hasMore={hasMore}
      error={error}
      onRetry={retry}
      setTriggerRef={setTriggerRef}
    />

    {/* 回到顶部按钮 */}
    {showBackToTop && <BackToTop threshold={backToTopThreshold} />}
  </div>
);
```

### 3. SearchResultsInfinite 组件

**位置**: `app/components/search/SearchResultsInfinite.tsx`

搜索结果的无限滚动实现，负责：

#### 主要功能
- **搜索参数处理**: 接收并处理搜索查询、类型、筛选条件
- **API调用**: 调用unifiedSearch进行数据获取
- **结果合并**: 处理不同类型搜索结果的合并逻辑
- **渲染配置**: 配置InfiniteScrollContainer的各种渲染函数

#### 核心实现
```typescript
// 加载更多数据的函数
const loadMore = useCallback(async (page: number) => {
  try {
    const response = await unifiedSearch({
      query,
      type,
      page,
      filters
    });

    // 处理不同类型的响应
    if (type === 'all') {
      // 综合搜索：合并所有类型的结果
      const multiResponse = response as any;
      const allItems: (Movie | Person)[] = [
        ...(multiResponse.movies?.results || []),
        ...(multiResponse.tvShows?.results || []),
        ...(multiResponse.people?.results || [])
      ];

      return {
        items: allItems,
        hasMore: page < Math.max(
          multiResponse.movies?.total_pages || 0,
          multiResponse.tvShows?.total_pages || 0,
          multiResponse.people?.total_pages || 0
        )
      };
    } else {
      // 单类型搜索
      const singleResponse = response as any;
      return {
        items: singleResponse.results || [],
        hasMore: page < (singleResponse.total_pages || 0)
      };
    }
  } catch (error) {
    console.error('搜索失败:', error);
    throw error;
  }
}, [query, type, filters]);
```

### 4. LoadingTrigger 组件

**位置**: `app/components/common/LoadingTrigger.tsx`

加载触发器组件，作为Intersection Observer的目标元素：

#### 状态展示
1. **加载中状态**: 显示加载动画和提示文字
2. **错误状态**: 显示错误信息和重试按钮
3. **完成状态**: 显示"已加载全部内容"
4. **待触发状态**: 显示"滚动加载更多"提示

#### 关键实现
```typescript
// 错误状态
if (error) {
  return (
    <div ref={setTriggerRef} className={`text-center py-8 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-error">
          <ExclamationTriangleIcon className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
        <button onClick={onRetry} className="btn btn-outline btn-sm gap-2">
          <ArrowPathIcon className="w-4 h-4" />
          重试
        </button>
      </div>
    </div>
  );
}

// 加载状态
if (loading) {
  return (
    <div ref={setTriggerRef} className={`text-center py-8 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-md"></span>
        <p className="text-sm text-base-content/60">正在加载更多内容...</p>
      </div>
    </div>
  );
}
```

### 5. BackToTop 组件

**位置**: `app/components/common/BackToTop.tsx`

回到顶部功能组件：

#### 主要功能
- **滚动监听**: 监听页面滚动位置
- **按钮显示**: 超过阈值时显示按钮
- **平滑滚动**: 点击后平滑滚动到顶部
- **性能优化**: 使用节流处理滚动事件

#### 关键实现
```typescript
// 监听滚动事件
useEffect(() => {
  const toggleVisibility = () => {
    if (window.pageYOffset > threshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 节流处理滚动事件
  let timeoutId: NodeJS.Timeout;
  const handleScroll = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(toggleVisibility, 100);
  };

  window.addEventListener('scroll', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(timeoutId);
  };
}, [threshold]);

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
```

## API层实现

### unifiedSearch 函数

**位置**: `app/lib/api/searchActions.ts`

统一搜索API，支持多种搜索类型：

#### 搜索类型处理
```typescript
switch (type) {
  case SearchTypeEnum.MOVIE:
    return await discoverMovies(trimmedQuery, filters, page);

  case SearchTypeEnum.TV:
    return await discoverTvShows(trimmedQuery, filters, page);

  case SearchTypeEnum.PERSON:
    return await peopleApi.search(trimmedQuery, page);

  case SearchTypeEnum.ALL:
    // 综合搜索：并行获取所有类型的结果
    const [moviesResponse, tvResponse, peopleResponse] = await Promise.allSettled([
      discoverMovies(trimmedQuery, filters, page),
      discoverTvShows(trimmedQuery, filters, page),
      peopleApi.search(trimmedQuery, page)
    ]);
    
    // 合并结果
    return {
      movies: moviesResponse.status === 'fulfilled' ? moviesResponse.value : emptyResponse,
      tvShows: tvResponse.status === 'fulfilled' ? tvResponse.value : emptyResponse,
      people: peopleResponse.status === 'fulfilled' ? peopleResponse.value : emptyResponse,
      totalResults: movies.total_results + tvShows.total_results + people.total_results
    };
}
```

## 配置选项

### InfiniteScrollConfig

```typescript
interface InfiniteScrollConfig {
  threshold?: number;    // 触发加载的距离阈值 (默认: 0.1)
  rootMargin?: string;   // Intersection Observer的rootMargin (默认: '100px')
  enabled?: boolean;     // 是否启用无限滚动 (默认: true)
}
```

### 使用示例

```typescript
<InfiniteScrollContainer
  loadMore={loadMore}
  renderItem={renderItem}
  renderEmpty={renderEmpty}
  renderError={renderError}
  config={{
    threshold: 0.1,        // 10%可见时触发
    rootMargin: '200px',   // 提前200px触发
    enabled: !!query       // 有搜索词时才启用
  }}
  showBackToTop={true}
  backToTopThreshold={500}
/>
```

## 性能优化

### 1. 防抖和节流
- **滚动事件节流**: BackToTop组件使用100ms节流
- **加载状态锁**: 防止重复加载请求

### 2. 内存管理
- **Observer清理**: 组件卸载时清理Intersection Observer
- **事件监听器清理**: 及时移除滚动事件监听器

### 3. 渲染优化
- **唯一Key生成**: 使用item.id和index生成唯一key
- **条件渲染**: 根据状态条件渲染不同内容

## 错误处理

### 1. 网络错误
- **重试机制**: 提供重试按钮
- **错误提示**: 显示具体错误信息
- **降级处理**: 部分API失败时仍显示成功的结果

### 2. 数据错误
- **空数据处理**: 显示"未找到结果"状态
- **格式验证**: 确保数据格式正确

### 3. 用户体验
- **加载状态**: 明确的加载指示器
- **完成提示**: "已加载全部内容"提示
- **平滑过渡**: 使用CSS过渡动画

## 总结

这套无限滚动系统具有以下特点：

1. **模块化设计**: 各组件职责清晰，易于维护和扩展
2. **类型安全**: 完整的TypeScript类型定义
3. **性能优化**: 合理的防抖节流和内存管理
4. **用户体验**: 丰富的状态提示和交互反馈
5. **错误处理**: 完善的错误处理和重试机制
6. **可配置性**: 灵活的配置选项适应不同场景

该实现为项目提供了稳定、高效的无限滚动功能，大大提升了搜索结果的浏览体验。
