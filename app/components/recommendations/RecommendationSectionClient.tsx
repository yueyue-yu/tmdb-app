/**
 * 推荐区域客户端组件
 * 处理推荐和相似内容的状态管理和交互
 */

'use client';

import { useState, useEffect, useReducer } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import RecommendationList, { RecommendationListStats } from './RecommendationList';
import ErrorBoundary, { ApiErrorFallback } from '@/app/components/common/ErrorBoundary';
import { fetchAllRecommendations } from '@/app/lib/api/recommendationActions';
import type {
  RecommendationSectionClientProps,
  RecommendationState,
  RecommendationAction,
  RecommendationTab
} from '@/app/type/recommendations';
import { RecommendationType } from '@/app/type/recommendations';

/**
 * 推荐状态管理
 */
function recommendationReducer(
  state: RecommendationState,
  action: RecommendationAction
): RecommendationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    case 'SET_SIMILAR':
      return { ...state, similar: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'RESET':
      return {
        recommendations: [],
        similar: [],
        isLoading: false,
        error: null,
        activeTab: RecommendationType.RECOMMENDATIONS
      };
    default:
      return state;
  }
}

/**
 * 推荐区域客户端组件
 */
export default function RecommendationSectionClient({
  mediaId,
  mediaType,
  mediaTitle,
  translations
}: RecommendationSectionClientProps) {
  const [state, dispatch] = useReducer(recommendationReducer, {
    recommendations: [],
    similar: [],
    isLoading: true,
    error: null,
    activeTab: RecommendationType.RECOMMENDATIONS
  });

  const [showCount, setShowCount] = useState(10);

  // 重试函数
  const retryLoadRecommendations = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    loadRecommendations();
  };

  // 加载推荐数据
  const loadRecommendations = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { recommendations, similar } = await fetchAllRecommendations(mediaId, mediaType);
      
      dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
      dispatch({ type: 'SET_SIMILAR', payload: similar });
    } catch (err) {
      console.error('获取推荐内容失败:', err);
      dispatch({ type: 'SET_ERROR', payload: translations.loadingError });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 初始加载
  useEffect(() => {
    loadRecommendations();
  }, [mediaId, mediaType]);

  // 创建标签页数据
  const tabs: RecommendationTab[] = [
    {
      key: RecommendationType.RECOMMENDATIONS,
      label: translations.recommendations,
      count: state.recommendations.length
    },
    {
      key: RecommendationType.SIMILAR,
      label: translations.similar,
      count: state.similar.length
    }
  ];

  // 获取当前显示的内容
  const currentItems = state.activeTab === RecommendationType.RECOMMENDATIONS 
    ? state.recommendations 
    : state.similar;

  const currentEmptyMessage = state.activeTab === RecommendationType.RECOMMENDATIONS
    ? translations.noRecommendations
    : translations.noSimilar;

  // 总数量
  const totalCount = state.recommendations.length + state.similar.length;

  // 如果没有任何内容且不在加载中，不显示组件
  if (!state.isLoading && !state.error && totalCount === 0) {
    return null;
  }

  return (
    <ErrorBoundary fallback={ApiErrorFallback}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="flex items-center gap-3 mb-6">
          <SparklesIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">
            {state.activeTab === RecommendationType.RECOMMENDATIONS 
              ? `${translations.recommendedFor} ${mediaTitle}`
              : `${translations.similarTo} ${mediaTitle}`
            }
          </h2>
          {!state.isLoading && totalCount > 0 && (
            <span className="text-base-content/60">({totalCount})</span>
          )}
        </div>

        {/* 错误状态 */}
        {state.error && (
          <ApiErrorFallback
            error={new Error(state.error)}
            resetError={retryLoadRecommendations}
            title={translations.loadingError}
            description="请检查网络连接后重试"
          />
        )}

        {/* 正常内容 */}
        {!state.error && (
          <>
            {/* 标签页导航 */}
            {tabs.some(tab => tab.count > 0 || state.isLoading) && (
              <div className="tabs tabs-bordered mb-6">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    className={`tab ${state.activeTab === tab.key ? 'tab-active' : ''}`}
                    onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.key })}
                    disabled={state.isLoading}
                  >
                    {tab.label}
                    {!state.isLoading && (
                      <span className="ml-1 text-xs opacity-60">({tab.count})</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* 统计信息 */}
            {!state.isLoading && currentItems.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                <RecommendationListStats
                  totalCount={currentItems.length}
                  showCount={showCount}
                />
                
                {currentItems.length > showCount && (
                  <button
                    onClick={() => setShowCount(prev => prev === 10 ? currentItems.length : 10)}
                    className="btn btn-outline btn-sm"
                  >
                    {showCount === 10 ? translations.showMore : translations.showLess}
                    {showCount === 10 && ` (${currentItems.length - showCount})`}
                  </button>
                )}
              </div>
            )}

            {/* 推荐列表 */}
            <ErrorBoundary>
              <RecommendationList
                items={currentItems}
                mediaType={mediaType}
                isLoading={state.isLoading}
                error={null}
                onRetry={retryLoadRecommendations}
                emptyMessage={currentEmptyMessage}
                showCount={showCount}
              />
            </ErrorBoundary>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
