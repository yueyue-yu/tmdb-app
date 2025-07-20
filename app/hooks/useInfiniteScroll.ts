'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 无限滚动状态接口
 */
export interface InfiniteScrollState<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  currentPage: number;
}

/**
 * 无限滚动配置接口
 */
export interface InfiniteScrollConfig {
  threshold?: number; // 触发加载的距离阈值
  rootMargin?: string; // Intersection Observer的rootMargin
  enabled?: boolean; // 是否启用无限滚动
}

/**
 * 加载函数类型
 */
export type LoadMoreFunction<T> = (page: number) => Promise<{
  items: T[];
  hasMore: boolean;
  totalPages?: number;
}>;

/**
 * 无限滚动自定义Hook
 * @param loadMore 加载更多数据的函数
 * @param config 配置选项
 * @returns 无限滚动状态和控制函数
 */
export function useInfiniteScroll<T>(
  loadMore: LoadMoreFunction<T>,
  config: InfiniteScrollConfig = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true
  } = config;

  // 状态管理
  const [state, setState] = useState<InfiniteScrollState<T>>({
    items: [],
    loading: false,
    hasMore: true,
    error: null,
    currentPage: 0
  });

  // 引用管理
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  // 加载更多数据
  const loadMoreData = useCallback(async () => {
    if (loadingRef.current || !state.hasMore || !enabled) {
      return;
    }

    loadingRef.current = true;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const nextPage = state.currentPage + 1;
      const result = await loadMore(nextPage);

      setState(prev => ({
        ...prev,
        items: [...prev.items, ...result.items],
        hasMore: result.hasMore,
        currentPage: nextPage,
        loading: false
      }));
    } catch (error) {
      console.error('加载更多数据失败:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '加载失败'
      }));
    } finally {
      loadingRef.current = false;
    }
  }, [loadMore, state.currentPage, state.hasMore, enabled]);

  // 重试加载
  const retry = useCallback(() => {
    if (state.error) {
      loadMoreData();
    }
  }, [loadMoreData, state.error]);

  // 重置状态
  const reset = useCallback(() => {
    setState({
      items: [],
      loading: false,
      hasMore: true,
      error: null,
      currentPage: 0
    });
    loadingRef.current = false;
  }, []);

  // 设置触发器引用
  const setTriggerRef = useCallback((node: HTMLDivElement | null) => {
    if (triggerRef.current) {
      observerRef.current?.unobserve(triggerRef.current);
    }

    triggerRef.current = node;

    if (node && enabled) {
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !loadingRef.current && state.hasMore) {
              loadMoreData();
            }
          },
          {
            threshold,
            rootMargin
          }
        );
      }

      observerRef.current.observe(node);
    }
  }, [enabled, threshold, rootMargin, loadMoreData, state.hasMore]);

  // 清理Observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // 初始加载
  useEffect(() => {
    if (enabled && state.items.length === 0 && !loadingRef.current) {
      loadMoreData();
    }
  }, [enabled, loadMoreData, state.items.length]);

  return {
    ...state,
    loadMore: loadMoreData,
    retry,
    reset,
    setTriggerRef
  };
}
